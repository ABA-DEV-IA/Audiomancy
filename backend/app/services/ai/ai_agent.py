from langchain.agents import initialize_agent, AgentType
from tools.web_search import web_search
from utils.azure_openai import get_llm

def get_agent():
    llm = get_llm()
    tools = [web_search]
    return initialize_agent(
        tools,
        llm,
        agent = AgentType.OPENAI_FUNCTIONS,
        verbose = True
    )










# import os
# #import base64
# from openai import AzureOpenAI
# from dotenv import load_dotenv

# load_dotenv(override=True)

# endpoint = os.getenv("ENDPOINT_URL")
# deployment = os.getenv("DEPLOYMENT_NAME")
# subscription_key = os.getenv("AZURE_OPENAI_API_KEY")

# client = AzureOpenAI(
#     azure_endpoint=endpoint,
#     api_key=subscription_key,
#     api_version="2025-01-01-preview",
# )


# def detect_works(message):
#     """
#     Function calling the GPT-4o-mini model and analyzing the user's message to detect a potential work cited.
#     Returns the result in JSON format {"work": "Harry Potter", "type": "book"}

#     Args:
#         message: user message

#     Returns:
#         json: response in the format {"work": "Harry Potter", "type": "book"}, or {"work": null} if no work cited is found.
#     """

#     user_message = f"Text : {message}"
#     messages = [
#         {
#             "role": "system",
#             "content": "You are a cultural assistant. Your task is to extract any mentioned work of art (video game, book, movie, etc.) from a given user message.  \nRespond in JSON format like this:\n{\"work\": \"The Witcher 3\", \"type\": \"video game\"}\n\nIf no work is detected, respond:\n{\"work\": null}"
#         },
#         {
#             "role": "user",
#             "content": user_message
#         }
#     ]


#     response = client.chat.completions.create(
#         model=deployment,
#         messages=messages,
#         max_tokens=800,
#         temperature=0.5,
#     )

#     return response.choices[0].message.content


# message = "Je suis de bonne humeur crée moi une playlist adaptée."
# print(detect_works(message))
