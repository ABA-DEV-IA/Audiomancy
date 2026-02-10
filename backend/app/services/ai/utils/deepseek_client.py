"""
DeepSeek LLM client wrapper with debug logging and Prometheus metrics.

Provides a minimal and robust abstraction over the DeepSeek API
for text generation in a ReAct-based agent.

Note: DeepSeek API is OpenAI-compatible, so we use the OpenAI SDK
with a custom base_url pointing to DeepSeek's API endpoint.
"""

import time
import logging
from typing import Optional
from openai import OpenAI
from app.core.config import settings
from app.routes.metrics_routes import (
    deepseek_requests_total,
    deepseek_latency_seconds,
    deepseek_tokens_used,
    deepseek_errors_total
)

logger = logging.getLogger(__name__)


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
        # Start timer for latency metric
        start_time = time.time()

        messages = []

        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})

        messages.append({"role": "user", "content": prompt})

        # 🔹 Debug log of the outgoing messages
        logger.debug("Sending messages to DeepSeek API:")
        for msg in messages:
            snippet = msg['content'][:500] + ("..." if len(msg['content']) > 500 else "")
            logger.debug(" - %s: %s", msg['role'], snippet)

        try:
            # Use OpenAI SDK's chat completion API (compatible with DeepSeek)
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=self.temperature,
                max_tokens=self.max_tokens,
            )

            # Record successful request
            deepseek_requests_total.labels(status="success").inc()

            # Record latency
            latency = time.time() - start_time
            deepseek_latency_seconds.observe(latency)

            # Defensive checks
            if not response or not response.choices:
                deepseek_errors_total.labels(error_type="empty_response").inc()
                raise RuntimeError("DeepSeek returned an empty response")

            choice = response.choices[0]
            content = choice.message.content

            if not content:
                deepseek_errors_total.labels(error_type="no_content").inc()
                raise RuntimeError("DeepSeek response contained no content")

            # Record token usage (if available)
            if hasattr(response, 'usage') and response.usage:
                if hasattr(response.usage, 'prompt_tokens'):
                    deepseek_tokens_used.labels(type="prompt").inc(response.usage.prompt_tokens)
                if hasattr(response.usage, 'completion_tokens'):
                    deepseek_tokens_used.labels(type="completion").inc(response.usage.completion_tokens)
                if hasattr(response.usage, 'total_tokens'):
                    deepseek_tokens_used.labels(type="total").inc(response.usage.total_tokens)

            # 🔹 Debug log of the incoming response
            snippet = content[:500] + ("..." if len(content) > 500 else "")
            logger.debug("Received response from DeepSeek:\n%s", snippet)
            logger.info("DeepSeek API call completed in %.2fs", latency)

            return content.strip()

        except RuntimeError:
            raise  # Re-raise intentional RuntimeErrors (empty response, no content)
        except Exception as exc:
            # Record failed request
            deepseek_requests_total.labels(status="error").inc()
            error_type = type(exc).__name__
            deepseek_errors_total.labels(error_type=error_type).inc()

            logger.error(
                "DeepSeek API call failed: %s",
                exc,
                extra={"error_type": error_type},
                exc_info=True
            )
            raise RuntimeError(f"DeepSeek API call failed: {exc}") from exc
