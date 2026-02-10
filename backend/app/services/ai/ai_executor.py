"""
AI Executor — point d'entrée haut niveau du pipeline IA.

Orchestre le flux complet :  prompt utilisateur → agent ReAct (DeepSeek)
→ filtrage des tags → résultat prêt pour Jamendo.
"""

import logging

from app.services.ai.ai_agent import AIAgent
from app.services.ai.utils.filter_final_answer import filter_final_answer

logger = logging.getLogger(__name__)

AI_AGENT = AIAgent()


def ai_executor(prompt: str) -> str:
    """Exécute le pipeline IA complet et retourne les tags musicaux filtrés.

    Args:
        prompt: Description libre de l'ambiance ou du style musical souhaité.

    Returns:
        Chaîne de tags séparés par des espaces (max 7), prête à être
        envoyée à l'API Jamendo.
    """
    response = AI_AGENT.run(prompt)
    filtered_response = filter_final_answer(response)

    logger.info("Returning tags to Jamendo: '%s'", filtered_response)

    return filtered_response
