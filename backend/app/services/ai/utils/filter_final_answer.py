""" Module providing the function filtering the final response from the agent """


def filter_final_answer(text: str) -> str:
    """
    Given a text, returns the content of the line that starts with "Final Answer:"
    (case insensitive). If no such line is found, returns the whole text.

    The purpose of this function is to extract the final answer provided by the
    AI agent from the full text of its output.

    Args:
        text (str): The text to process.

    Returns:
        str: The final answer if found, the whole text otherwise.
    """

    final_answer = None

    for line in text.splitlines():
        line_lower = line.lower().strip()
        if line_lower.startswith("final answer:"):
            final_answer = line.split(":", 1)[1].strip()

    if final_answer is None:
        return text.strip()

    return final_answer
