"""Web search tool using DuckDuckGo for the AI agent."""

from ddgs import DDGS


def web_search(query: str) -> str:
    """Search DuckDuckGo and return the first result's text and source URL."""

    try:
        with DDGS() as ddgs:
            results = ddgs.text(query, max_results=1)
            for r in results:
                source = r.get("href", "unknown")
                text = r.get("body", "")
                return f"{text}\n\n(Source: {source})"
    except Exception:
        return "NO RESULT"

    return "NO RESULT"
