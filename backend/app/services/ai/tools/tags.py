import json
from langchain.tools import tool

with open("backend\app\services\ai\data\jamendo_tags_list.json", "r", encoding="utf-8") as f:
    TAGS = json.load(f)


@tool
def choose_tags(prompt: str) -> list:
    """
    Tool for choosing the most relevant tags based on the user prompt from a predefined list

    """

    return [tag for tag in TAGS if tag.lower() in prompt.lower()]