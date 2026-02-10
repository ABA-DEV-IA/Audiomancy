"""
AI agent module using DeepSeek with a custom ReAct execution loop.

This agent follows a ReAct-style prompting strategy:
- Thought
- Action (web_search)
- Observation
- Final Answer

The system prompt is loaded from an external text file to keep
prompt engineering decoupled from application logic.
"""

from pathlib import Path
from typing import Optional

from app.services.ai.tools.web_search import web_search
from app.services.ai.utils.deepseek_client import DeepSeekClient
from app.services.ai.utils.filter_final_answer import filter_final_answer


# ---------------------------------------------------------------------
# 🔧 AGENT CONFIGURATION
# ---------------------------------------------------------------------
MAX_WEB_SEARCH = 3
MAX_ITERATIONS = 5

SYSTEM_PROMPT_PATH = Path(__file__).parent / "utils" / "system_prompt.txt"


# ---------------------------------------------------------------------
# 🔹 Load system prompt from file
# ---------------------------------------------------------------------
with SYSTEM_PROMPT_PATH.open("r", encoding="utf-8") as f:
    system_prompt = f.read()


class AIAgent:
    """
    Custom ReAct-based AI agent using DeepSeek as the LLM backend.

    This agent:
    - Executes a bounded ReAct loop
    - Uses web_search as an external tool
    - Enforces limits on iterations and tool usage
    - Extracts a clean "Final Answer" at the end
    - Logs all interactions for debugging
    """

    def __init__(self, verbose: bool = True):
        self.verbose = verbose
        self.deepseek = DeepSeekClient()

    def _log(self, message: str) -> None:
        if self.verbose:
            print(message)

    def _build_llm_input(self, prompt: str, scratchpad: str) -> str:
        """
        Build the full input sent to the LLM, replacing placeholders.

        Args:
            prompt (str): User question.
            scratchpad (str): Accumulated Thought/Observation history.

        Returns:
            str: Fully formatted LLM input ready for DeepSeek.
        """
        filled_prompt = system_prompt.replace("{tools}", "web_search") \
                                     .replace("{tool_names}", "web_search") \
                                     .replace("{agent_scratchpad}", scratchpad)
        filled_prompt += f"\nQuestion: {prompt}"
        return filled_prompt

    def _extract_action_input(self, response: str) -> Optional[str]:
        for line in response.splitlines():
            if line.strip().startswith("Action Input:"):
                return line.split(":", 1)[1].strip()
        return None

    def run(self, prompt: str) -> str:
        scratchpad = ""
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

            # ----------------------------------------------------------
            # ✅ Final Answer → stop execution
            # ----------------------------------------------------------
            if "Final Answer:" in response:
                self._log("[Final Answer detected]")
                return filter_final_answer(response)

            # ----------------------------------------------------------
            # 🔧 Tool call: web_search
            # ----------------------------------------------------------
            if "Action: web_search" in response:
                if web_search_count >= MAX_WEB_SEARCH:
                    self._log("[Max web_search reached → forcing output]")
                    return filter_final_answer(response)

                query = self._extract_action_input(response)
                if not query:
                    self._log("[Action Input missing → continuing]")
                    scratchpad += f"\n{response}"
                    continue

                web_search_count += 1
                self._log(f"[web_search #{web_search_count}] Query: {query}")

                try:
                    observation = web_search(query)
                except Exception as exc:
                    self._log(f"[web_search error] {exc}")
                    observation = "Web search failed, no result available."
                self._log(f"[web_search #{web_search_count}] Observation: {observation}")

                scratchpad += f"""
Thought: I searched for additional context.
Observation: {observation}
"""
                continue

            # ----------------------------------------------------------
            # 🟡 Intermediate reasoning (Thought only)
            # ----------------------------------------------------------
            scratchpad += f"\n{response}"

        # --------------------------------------------------------------
        # 🔁 Safety fallback
        # --------------------------------------------------------------
        self._log("[Max iterations reached → fallback]")
        return filter_final_answer(scratchpad)
