"""
DeepSeek LLM client wrapper with debug logging.

Provides a minimal and robust abstraction over the DeepSeek API
for text generation in a ReAct-based agent.

Note: DeepSeek API is OpenAI-compatible, so we use the OpenAI SDK
with a custom base_url pointing to DeepSeek's API endpoint.
"""

from typing import Optional
from openai import OpenAI
from app.core.config import settings


class DeepSeekClient:
    """
    Thin wrapper around the OpenAI SDK configured for DeepSeek API.

    Responsibilities:
    - Centralize DeepSeek configuration
    - Handle API errors gracefully
    - Provide a stable text generation interface
    - Log prompts and responses for debugging
    """

    def __init__(self):
        """
        Initialize the DeepSeek client using application settings.
        """
        if not settings.deepseek_api_key:
            raise RuntimeError("DEEPSEEK_API_KEY is not set")

        # DeepSeek API is OpenAI-compatible, use OpenAI SDK with custom base_url
        base_url = getattr(settings, "deepseek_base_url", "https://api.deepseek.com")
        self.client = OpenAI(
            api_key=settings.deepseek_api_key,
            base_url=base_url
        )
        self.model: str = getattr(settings, "deepseek_model", "deepseek-chat")
        self.temperature: float = getattr(settings, "deepseek_temperature", 0)
        self.max_tokens: int = getattr(settings, "deepseek_max_tokens", 512)

    def generate(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        """
        Send a prompt to DeepSeek and return the generated text.

        Args:
            prompt (str): User prompt or full ReAct prompt.
            system_prompt (Optional[str]): Optional system message.

        Returns:
            str: Generated text from the model.

        Raises:
            RuntimeError: If the API response is invalid or empty.
        """
        messages = []

        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})

        messages.append({"role": "user", "content": prompt})

        # 🔹 Debug log of the outgoing messages
        print("⚡️ [DeepSeek DEBUG] Sending messages to API:")
        for msg in messages:
            snippet = msg['content'][:500] + ("..." if len(msg['content']) > 500 else "")
            print(f" - {msg['role']}: {snippet}")

        try:
            # Use OpenAI SDK's chat completion API (compatible with DeepSeek)
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=self.temperature,
                max_tokens=self.max_tokens,
            )
        except Exception as exc:
            raise RuntimeError(f"DeepSeek API call failed: {exc}") from exc

        # Defensive checks
        if not response or not response.choices:
            raise RuntimeError("DeepSeek returned an empty response")

        choice = response.choices[0]
        content = choice.message.content

        if not content:
            raise RuntimeError("DeepSeek response contained no content")

        # 🔹 Debug log of the incoming response
        snippet = content[:500] + ("..." if len(content) > 500 else "")
        print(f"⚡️ [DeepSeek DEBUG] Received response:\n{snippet}\n")

        return content.strip()
