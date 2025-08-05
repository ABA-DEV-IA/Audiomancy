from ai_agent import get_agent

def main():
    prompt = input("Exprimez votre souhait...")
    agent = get_agent()
    response = agent.run(prompt)
    print("\n🎵 Playlist générée :")
    print(response)

if __name__ == "__main__":
    main()