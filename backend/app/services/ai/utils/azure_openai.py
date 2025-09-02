""" Module creating the LLM for the AI agent """

from langchain_openai import AzureChatOpenAI
from app.core.config import settings

def get_llm():
    """
    Returns an instance of the AzureChatOpenAI language model.

    The endpoint, deployment name, and subscription key are loaded from environment
    variables. The API version is set to "2025-01-01-preview" and the temperature is set
    to 0.

    Returns:
        AzureChatOpenAI: the LLM instance
    """

    endpoint = settings.endpoint_url
    deployment = settings.deployment_name
    subscription_key = settings.azure_openai_api_key

    return AzureChatOpenAI(
        azure_endpoint=endpoint,
        azure_deployment=deployment,
        api_key=subscription_key,
        api_version="2025-01-01-preview",
        temperature=0
    )
