""" 
Module providing the AI agent needed to analyze the user prompt.
"""

from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain.tools import Tool
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from app.services.ai.tools.web_search import web_search
from app.services.ai.utils.azure_openai import get_llm


# Load system prompt once
with open("app/services/ai/utils/system_prompt.txt", "r", encoding="utf-8") as f:
    system_prompt = f.read()


class AIAgent:
    """
    Class defining the AI Agent.
    """

    def __init__(self, verbose: bool = True) -> None:
        """
        Initializes the AI_Agent class.

        Args:
            verbose (bool): If True, the agent will provide verbose output.
        """
        self.llm = get_llm()

        self.tools = [
            Tool.from_function(
                func=web_search,
                name="web_search",
                description="Search for information about history or themes covered about a mentioned work, in English or French ONLY."
            )
        ]

        self.prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "{input}"),
            MessagesPlaceholder(variable_name="agent_scratchpad"),
        ]).partial(
            tools="\n".join([f"{tool.name}: {tool.description}" for tool in self.tools]),
            tool_names=", ".join([tool.name for tool in self.tools])
        )

        agent_struct = create_openai_functions_agent(
            llm=self.llm,
            tools=self.tools,
            prompt=self.prompt
        )

        self.agent = AgentExecutor(
            agent=agent_struct,
            tools=self.tools,
            verbose=verbose,
            handle_parsing_errors=True,
            max_iterations=5,
            early_stopping_method="force"
        )

    async def run(self, prompt: str) -> str:
        """
        Runs the AI agent asynchronously with a given user prompt.

        Args:
            prompt (str): The user's prompt.

        Returns:
            str: The generated tags if found, otherwise an empty string.
        """
        try:
            result = await self.agent.ainvoke({"input": prompt})
            output = result.get("output", result.get("final_output", ""))
            if output:
                return output
            print("No tags found.")
            return ""
        except Exception as e:
            print(f"An error occurred: {e}")
            return ""
