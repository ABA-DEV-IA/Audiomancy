import os
#from openai import AzureOpenAI
from langchain_openai import AzureChatOpenAI
from dotenv import load_dotenv

def get_llm():
    """
    Returns an instance of AzureOpenAI, the client for the Azure OpenAI
    service. The instance is configured from the following environment
    variables:

    - ENDPOINT_URL: the URL of the Azure OpenAI service
    - DEPLOYMENT_NAME: the name of the deployment to use
    - AZURE_OPENAI_API_KEY: the subscription key for the deployment

    The API version is set to "2025-01-01-preview", which is the latest
    available version at the time of writing.

    Returns:
        AzureOpenAI: the configured client
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
