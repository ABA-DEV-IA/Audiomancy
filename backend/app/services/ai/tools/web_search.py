from langchain.tools import tool
from ddgs import DDGS

@tool
def web_search(query: str) -> str:
    """
    Performs a web search using DuckDuckGo and returns the first result's text and source.

    Args:
        query (str): The search query string.

    Returns:
        str: The text of the first search result followed by its source URL.
            If no results are found, returns "NO RESULT".
    """

    with DDGS() as ddgs:
        results = ddgs.text(query, max_results=1)
        for r in results:
            source = r.get("href", "unknown")
            text = r.get("body", "")
            return f"{text}\n\n(Source: {source})"
        
    return "NO RESULT"