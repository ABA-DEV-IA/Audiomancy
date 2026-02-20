"""DeepSeek LLM client with logging and Prometheus metrics.

Uses the OpenAI SDK with a custom base_url since DeepSeek's API
is OpenAI-compatible.
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


class DeepSeekClient:  # pylint: disable=too-few-public-methods
    """Thin wrapper around OpenAI SDK configured for DeepSeek."""

    def __init__(self):
        self.api_key = settings.deepseek_api_key
        self.base_url = settings.deepseek_base_url or "https://api.deepseek.com"
        self.model = settings.deepseek_model or "deepseek-chat"
        self.temperature = settings.deepseek_temperature
        self.max_tokens = settings.deepseek_max_tokens
        self.client: Optional[OpenAI] = None

        # Initialize client only if API key is available
        if self.api_key:
            self.client = OpenAI(
                api_key=self.api_key,
                base_url=self.base_url
            )

    def generate(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        """Send a prompt to DeepSeek and return the generated text.

        Raises RuntimeError on empty responses or API failures.
        """
        # Check if API key is configured
        if not self.client or not self.api_key:
            raise RuntimeError(
                "DEEPSEEK_API_KEY is not set. "
                "Configure it in .env or via Vault to use AI features."
            )

        # Start timer
        start_time = time.time()

        messages = []

        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})

        messages.append({"role": "user", "content": prompt})

        logger.debug("Sending %d messages to DeepSeek API", len(messages))

        try:
            # Use OpenAI SDK's chat completion API (compatible with DeepSeek)
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=self.temperature,
                max_tokens=self.max_tokens,
                stop=["Observation:"],
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

            # Record token usage
            if response.usage:
                deepseek_tokens_used.labels(type="prompt").inc(
                    response.usage.prompt_tokens or 0
                )
                deepseek_tokens_used.labels(type="completion").inc(
                    response.usage.completion_tokens or 0
                )
                deepseek_tokens_used.labels(type="total").inc(
                    response.usage.total_tokens or 0
                )

            logger.debug("DeepSeek response: %s", content[:300])
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
            raise RuntimeError(
                f"DeepSeek API call failed: {exc}"
            ) from exc
