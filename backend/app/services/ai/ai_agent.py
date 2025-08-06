from langchain.agents import AgentExecutor, create_react_agent
from langchain.tools import Tool
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from tools.web_search import web_search
from tools.tags import choose_tags
from utils.azure_openai import get_llm

with open("backend/app/services/ai/utils/system_prompt.txt", "r", encoding="utf-8") as f:
    system_prompt = f.read()

class AI_Agent:
    def __init__(self, verbose=True):
        self.llm = get_llm()

        self.tools = [
            Tool.from_function(func=web_search, name="web_search",
                               description="Search for ambiance or theme information about a mentioned work."),
            Tool.from_function(func=choose_tags, name="choose_tags",
                               description="Validate 3 tags from the predefined list, space-separated string.")
        ]

        self.prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "{input}"),
        ])


        agent_struct = create_react_agent(
            llm=self.llm,
            tools=self.tools,
            prompt=self.prompt
        )
        
        self.agent = AgentExecutor.from_agent_and_tools(
            agent=agent_struct, 
            tools=self.tools,
            verbose=verbose, 
            handle_parsing_errors=True,
            max_iterations=5
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
result = agent.search(prompt="Je voudrais une ambiance du style Harry Potter pour étudier")
print(result)