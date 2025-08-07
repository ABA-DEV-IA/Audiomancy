""" Module for testing the AI agent """

from ai_agent import AIAgent
from utils.filter_final_answer import filter_final_answer


def execution_test():
    """
    Executes a test of the AI agent by prompting the user for input, running the agent
    with the provided prompt, and displaying the generated music tags.

    This function prompts the user to express their wish, invokes the AI_Agent to process
    the prompt, and filters the final output to display the generated music tags.
    """

    prompt = input("Exprimez votre souhait...")
    agent = AIAgent()
    response = agent.run(prompt)
    print("\n🎵 Tags générés :")
    print(filter_final_answer(response))


if __name__ == "__main__":
    execution_test()
