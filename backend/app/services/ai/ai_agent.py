from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain.tools import Tool
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from tools.web_search import web_search
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
                description="Search for information about history or themes covered about a mentioned work, in english or french ONLY.")
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

    def search(self, prompt: str):
        try:
            result = self.agent.invoke({"input": prompt})
            output = result.get("output", result.get("final_output", ""))
            if output:
                print(output)
            else:
                print("No tags found.")
        except Exception as e:
            print(f"An error occurred: {e}")




agent = AI_Agent()
result = agent.search(prompt="Je voudrais une playlist de fond pour une partie d'Elden Ring")