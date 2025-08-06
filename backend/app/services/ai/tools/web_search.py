from langchain.tools import tool
from ddgs import DDGS

@tool
def web_search(query: str) -> str:
    """ Web search with DuckDuckgo to find informations about a work"""

    with DDGS() as ddgs:
        results = ddgs.text(query, max_results=1)
        for r in results:
            source = r.get("href", "unknown")
            text = r.get("body", "")
            print(f"[web_search] Query: {query}")
            print(f"[web_search] Source: {source}")
            print(f"[web_search] Text: {text}")
            return f"{text}\n\n(Source: {source})"
        
    print(f"[web_search] Query: {query} - NO RESULT")
    return "NO RESULT"