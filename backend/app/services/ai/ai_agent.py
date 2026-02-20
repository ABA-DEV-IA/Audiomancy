"""ReAct agent for music tag generation with DeepSeek and web search."""

import logging
from pathlib import Path
from typing import Optional

from app.services.ai.tools.web_search import web_search
from app.services.ai.utils.deepseek_client import DeepSeekClient
from app.services.ai.utils.filter_final_answer import filter_final_answer

logger = logging.getLogger(__name__)

MAX_WEB_SEARCH = 3
MAX_ITERATIONS = 5

SYSTEM_PROMPT_PATH = Path(__file__).parent / "utils" / "system_prompt.txt"

with SYSTEM_PROMPT_PATH.open("r", encoding="utf-8") as f:
    system_prompt = f.read()


class AIAgent:
    """ReAct agent with bounded iteration loop and web search tool."""

    def __init__(self, verbose: bool = True):
        self.verbose = verbose
        self.deepseek = DeepSeekClient()

    def _log(self, message: str) -> None:
        if self.verbose:
            logger.debug(message)

    def _build_llm_input(self, prompt: str, scratchpad: str) -> str:
        """Build LLM input with system prompt and scratchpad."""
        return system_prompt.replace("{tools}", "web_search") \
                            .replace("{tool_names}", "web_search") \
                            .replace("{agent_scratchpad}", scratchpad)

    def _extract_action_input(self, response: str) -> Optional[str]:
        for line in response.splitlines():
            if line.strip().startswith("Action Input:"):
                return line.split(":", 1)[1].strip()
        return None

    def run(self, prompt: str) -> str:
        scratchpad = f"Question: {prompt}\n"
        web_search_count = 0

        for iteration in range(MAX_ITERATIONS):
            self._log(f"\n[Iteration {iteration + 1}]")

            llm_input = self._build_llm_input(prompt, scratchpad)
            self._log(f"[LLM Input]\n{llm_input[:1000]}{'...' if len(llm_input) > 1000 else ''}\n")

            try:
                response = self.deepseek.generate(llm_input)
            except Exception as exc:
                self._log(f"[DeepSeek error] {exc}")
                raise RuntimeError(f"DeepSeek generation failed: {exc}") from exc

            self._log(f"[DeepSeek Response]\n{response[:1000]}{'...' if len(response) > 1000 else ''}\n")

            # Final Answer detected — stop execution
            if "Final Answer:" in response:
                self._log("[Final Answer detected]")
                return filter_final_answer(response)

            # Tool call: web_search
            if "Action: web_search" in response:
                if web_search_count >= MAX_WEB_SEARCH:
                    self._log("[Max web_search reached → requesting Final Answer]")
                    force_scratchpad = (
                        scratchpad
                        + f"{response}\n"
                        + "Thought: I have used web_search 3 times. I must now give the Final Answer.\n"
                    )
                    force_input = self._build_llm_input(prompt, force_scratchpad)
                    final_response = self.deepseek.generate(force_input)
                    return filter_final_answer(final_response)

                query = self._extract_action_input(response)
                if not query:
                    self._log("[Action Input missing → continuing]")
                    scratchpad += f"{response}\n"
                    continue

                web_search_count += 1
                self._log(f"[web_search #{web_search_count}] Query: {query}")

                try:
                    observation = web_search(query)
                except Exception as exc:
                    self._log(f"[web_search error] {exc}")
                    observation = "Web search failed, no result available."
                self._log(f"[web_search #{web_search_count}] Observation: {observation}")

                scratchpad += f"{response}\nObservation: {observation}\n"
                continue

            # Response looks like bare tags (no structural keywords) — treat as Final Answer
            if not any(kw in response for kw in ("Thought:", "Action:", "Question:", "Observation:")):
                self._log("[Bare tags detected — treating as Final Answer]")
                return filter_final_answer(f"Final Answer: {response}")

            # Intermediate reasoning — append to scratchpad
            scratchpad += f"{response}\n"

        # Max iterations reached
        self._log("[Max iterations reached — fallback]")
        return filter_final_answer(scratchpad)
