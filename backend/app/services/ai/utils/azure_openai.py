""" Module creating the LLM for the AI agent """

import os
from langchain_openai import AzureChatOpenAI
from dotenv import load_dotenv


def get_llm():
    """
    Returns an instance of the AzureChatOpenAI language model.

    The endpoint, deployment name, and subscription key are loaded from environment
    variables. The API version is set to "2025-01-01-preview" and the temperature is set
    to 0.

    Returns:
        AzureChatOpenAI: the LLM instance
    """

    load_dotenv(override=True)

    endpoint = os.getenv("ENDPOINT_URL")
    deployment = os.getenv("DEPLOYMENT_NAME")
    subscription_key = os.getenv("AZURE_OPENAI_API_KEY")

    return AzureChatOpenAI(
        azure_endpoint=endpoint,
        azure_deployment=deployment,
        api_key=subscription_key,
        api_version="2025-01-01-preview",
        temperature=0
    )
