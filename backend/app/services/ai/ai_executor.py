"""AI pipeline orchestrator: prompt → ReAct agent → filtered tags."""

import logging

from app.services.ai.ai_agent import AIAgent

logger = logging.getLogger(__name__)

AI_AGENT = AIAgent()


def ai_executor(prompt: str) -> str:
    """Execute AI pipeline and return music tags."""
    response = AI_AGENT.run(prompt)
    logger.info("Returning tags to Jamendo: '%s'", response)
    return response
