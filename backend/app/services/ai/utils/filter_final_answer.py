"""
Module providing the function filtering the final response from the agent
"""

def filter_final_answer(text: str) -> str:
    """
    Extracts and validates the 'Final Answer' line from the agent output.

    Ensures:
    - Only the content after 'Final Answer:' is returned
    - Exactly 7 space-separated tags
    """

    final_answer = None

    for line in text.splitlines():
        if line.lower().strip().startswith("final answer:"):
            final_answer = line.split(":", 1)[1].strip()
            break

    if not final_answer:
        print("⚠️  [FILTER DEBUG] No 'Final Answer:' found in response")
        return text.strip()

    print(f"✅ [FILTER DEBUG] Raw Final Answer: {final_answer}")

    # 🔒 Normalisation et sécurité
    tags = final_answer.split()

    # Si le modèle dévie, on coupe proprement
    if len(tags) > 7:
        print(f"⚠️  [FILTER DEBUG] Truncating {len(tags)} tags to 7")
        tags = tags[:7]

    result = " ".join(tags)
    print(f"🎯 [FILTER DEBUG] Extracted Tags ({len(tags)}): {result}")
    
    return result
