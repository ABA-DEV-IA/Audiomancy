"""Extract and validate Final Answer from AI agent output."""

import logging

logger = logging.getLogger(__name__)


def filter_final_answer(text: str) -> str:
    """Extract Final Answer and limit to 7 tags."""

    final_answer = None

    for line in text.splitlines():
        if line.lower().strip().startswith("final answer:"):
            final_answer = line.split(":", 1)[1].strip()
            break

    if not final_answer:
        logger.warning("No 'Final Answer:' found in response")
        # Try to find the last short line that looks like tags
        for line in reversed(text.splitlines()):
            line = line.strip()
            if not line:
                continue
            if any(kw in line for kw in ("Thought:", "Action:", "Action Input:", "Question:", "Observation:", "Final Answer:")):
                continue
            words = line.split()
            if 1 <= len(words) <= 7:
                logger.debug("Extracted tags from last line: %s", line)
                final_answer = line
                break
        if not final_answer:
            logger.error("Could not extract any tags from response")
            return ""

    logger.debug("Raw Final Answer: %s", final_answer)

    tags = final_answer.split()
    if len(tags) > 7:
        logger.debug("Truncating %d tags to 7", len(tags))
        tags = tags[:7]

    result = " ".join(tags)
    logger.debug("Extracted tags (%d): %s", len(tags), result)

    return result
