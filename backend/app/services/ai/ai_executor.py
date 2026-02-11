"""AI Executor — top-level entry point for the AI pipeline.

Orchestrates: user prompt -> ReAct agent (DeepSeek) -> tag filtering -> Jamendo-ready result.
"""

import logging

from app.services.ai.ai_agent import AIAgent

logger = logging.getLogger(__name__)

AI_AGENT = AIAgent()


def ai_executor(prompt: str) -> str:
    """Run the full AI pipeline and return filtered music tags."""
    response = AI_AGENT.run(prompt)
    logger.info("Returning tags to Jamendo: '%s'", response)
    return response
