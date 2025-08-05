import os
from openai import AzureOpenAI
from dotenv import load_dotenv

def get_llm():

    load_dotenv(override=True)

    endpoint = os.getenv("ENDPOINT_URL")
    deployment = os.getenv("DEPLOYMENT_NAME")
    subscription_key = os.getenv("AZURE_OPENAI_API_KEY")

    return AzureOpenAI(
        azure_endpoint=endpoint,
        azure_deployment=deployment,
        api_key=subscription_key,
        api_version="2025-01-01-preview",
)
