from app.services.ai.ai_agent import AIAgent
from app.services.ai.utils.filter_final_answer import filter_final_answer

AI_AGENT = AIAgent()

def ai_executor(prompt: str) -> str:

    response = AI_AGENT.run(prompt)
    filtered_response = filter_final_answer(response)

    return filtered_response
