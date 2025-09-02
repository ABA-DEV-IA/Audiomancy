"""
Module to execute AI tasks by orchestrating the AIAgent and post-processing its response.
"""

from app.services.ai.ai_agent import AIAgent
from app.services.ai.utils.filter_final_answer import filter_final_answer

AI_AGENT = AIAgent()


async def ai_executor(prompt: str) -> str:
    """
    Execute the AI agent with the given prompt, then filter the response.

    Args:
        prompt (str): The user input.

    Returns:
        str: The filtered AI response.
    """
    response = await AI_AGENT.run(prompt)
    return filter_final_answer(response)
