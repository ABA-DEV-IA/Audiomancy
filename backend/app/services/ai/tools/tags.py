import json
from langchain.tools import tool

@tool
def choose_tags(prompt: str) -> str:
    """
    Validates 3 tags provided in a space-separated string.
    Only returns those that are in the predefined list.
    """
    with open("backend/app/services/ai/data/jamendo_tags_list.json", "r", encoding="utf-8") as f:
        TAGS = set(json.load(f)["tags"])

    requested = prompt.lower().split()
    valid = [tag for tag in requested if tag in TAGS]

    return " ".join(valid[:3])