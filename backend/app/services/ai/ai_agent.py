from langchain.agents import initialize_agent
from langchain.agents.agent_types import AgentType
from langchain.tools import Tool
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
#from langchain.agents import initialize_agent, AgentType
from tools.web_search import web_search
from tools.tags import choose_tags
from utils.azure_openai import get_llm


with open("backend/app/services/ai/utils/system_prompt.txt", "r", encoding="utf-8") as f:
    system_prompt = f.read()


class AI_Agent:

    def __init__(self, verbose=True):

        self.llm = get_llm()

        self.tools = [
            Tool.from_function(
                func=web_search,
                name="web_search",
                description="Search for information about a work mentioned by the user."
            ),
            Tool.from_function(
                func=choose_tags,
                name="choose_tags",
                description="Tool for choosing the most relevant tags based on the user prompt from a predefined list."
            )
        ]

        self.prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "{input}"),
            MessagesPlaceholder(variable_name="agent_scratchpad")
        ])

        self.agent = initialize_agent(
            llm = self.llm,
            tools = self.tools,
            prompt = self.prompt,
            agent = AgentType.STRUCTURED_CHAT_ZERO_SHOT_REACT_DESCRIPTION,
            verbose = True,
            handle_parsing_errors=True,
        )


    def search(self, prompt: str):

        response = self.agent.invoke({
            "input": prompt
        })

        print(response["output"])



agent = AI_Agent()
agent.search(prompt="Je voudrais une ambiance du style Harry Potter pour étudier")