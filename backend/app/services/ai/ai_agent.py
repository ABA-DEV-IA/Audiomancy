import os
#import base64
from openai import AzureOpenAI
from dotenv import load_dotenv

load_dotenv(override=True)

endpoint = os.getenv("ENDPOINT_URL")
deployment = os.getenv("DEPLOYMENT_NAME")
subscription_key = os.getenv("AZURE_OPENAI_API_KEY")

client = AzureOpenAI(
    azure_endpoint=endpoint,
    api_key=subscription_key,
    api_version="2025-01-01-preview",
)


def detect_works(message):
    """
    Fonction appelant le modèle GPT-4o-mini et analysant le message utilisateur pour détecter une potentielle oeuvre citée.
    Retourne le résultat au format Json {"work": "Harry Potter", "type": "book"}

    Args:
        message : message utilisateur

    Returns:
        json: réponse au format {"work": "Harry Potter", "type": "book"}, ou {"work": null} si aucune oeuvre citée
    """

    user_message = f"Text : {message}"
    messages = [
        {
            "role": "system",
            "content": "You are a cultural assistant. Your task is to extract any mentioned work of art (video game, book, movie, etc.) from a given user message.  \nRespond in JSON format like this:\n{\"work\": \"The Witcher 3\", \"type\": \"video game\"}\n\nIf no work is detected, respond:\n{\"work\": null}"
        },
        {
            "role": "user",
            "content": user_message
        }
    ]


    response = client.chat.completions.create(
        model=deployment,
        messages=messages,
        max_tokens=800,
        temperature=0.5,
    )

    return response.choices[0].message.content


message = "Je suis de bonne humeur crée moi une playlist adaptée."
print(detect_works(message))
