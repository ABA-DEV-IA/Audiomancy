from langchain.tools import tool
from ddgs import DDGS

@tool
def web_search(query: str) -> str:
    """ Web search with DuckDuckgo to find informations about a work"""

    with DDGS() as ddgs:
        results = ddgs.text(query, max_results=1)
        for r in results:
            return r["body"]
        
    return "No information found."
