"""
Tests for the AI service layer (agent, executor, filter, DeepSeek client).

Covers:
- AIAgent ReAct loop (bounded iterations, web_search limit, final answer extraction)
- ai_executor integration (tag generation pipeline)
- filter_final_answer (parsing, truncation, edge cases)
- DeepSeekClient error handling
"""

import pytest
from unittest.mock import patch, MagicMock

from app.services.ai.utils.filter_final_answer import filter_final_answer
from app.services.ai.ai_agent import AIAgent, MAX_ITERATIONS, MAX_WEB_SEARCH
from app.services.ai.ai_executor import ai_executor


class TestFilterFinalAnswer:
    """Tests for the filter_final_answer utility."""

    def test_extracts_final_answer_from_response(self):
        """Should extract only the tags after 'Final Answer:'."""
        text = "Thought: I have enough context.\nFinal Answer: fantasy orchestral cinematic ambient dream epic medieval"
        result = filter_final_answer(text)
        assert result == "fantasy orchestral cinematic ambient dream epic medieval"

    def test_extracts_final_answer_case_insensitive(self):
        """Should handle 'final answer:' regardless of case."""
        text = "final answer: rock blues jazz funk soul indie pop"
        result = filter_final_answer(text)
        assert result == "rock blues jazz funk soul indie pop"

    def test_truncates_to_7_tags(self):
        """Should truncate to 7 tags if more are returned."""
        text = "Final Answer: tag1 tag2 tag3 tag4 tag5 tag6 tag7 tag8 tag9"
        result = filter_final_answer(text)
        tags = result.split()
        assert len(tags) == 7

    def test_returns_raw_text_when_no_final_answer(self):
        """Should return stripped raw text if no 'Final Answer:' is found."""
        text = "Thought: I need more context.\nAction: web_search"
        result = filter_final_answer(text)
        assert result == text.strip()

    def test_handles_empty_string(self):
        """Should handle empty input gracefully."""
        result = filter_final_answer("")
        assert result == ""

    def test_handles_final_answer_with_exact_7_tags(self):
        """Should keep exactly 7 tags without truncation."""
        text = "Final Answer: ambient chillout lofi jazz dreamy peaceful soft"
        result = filter_final_answer(text)
        tags = result.split()
        assert len(tags) == 7

    def test_handles_fewer_than_7_tags(self):
        """Should return fewer tags without error if model returns < 7."""
        text = "Final Answer: rock metal"
        result = filter_final_answer(text)
        assert result == "rock metal"

    def test_extracts_from_multiline_with_extra_content(self):
        """Should only extract the first Final Answer line."""
        text = (
            "Thought: Let me reason.\n"
            "Action: web_search\n"
            "Observation: Some results.\n"
            "Thought: I know enough now.\n"
            "Final Answer: fantasy epic cinematic orchestral ambient classical medieval\n"
            "Some extra text that should be ignored."
        )
        result = filter_final_answer(text)
        assert "fantasy" in result
        assert "Some extra text" not in result


class TestAIAgent:
    """Tests for the AIAgent ReAct loop."""

    @patch("app.services.ai.ai_agent.DeepSeekClient")
    def test_returns_final_answer_on_first_iteration(self, MockClient):
        """Should stop immediately when LLM returns a Final Answer."""
        mock_instance = MockClient.return_value
        mock_instance.generate.return_value = (
            "Thought: I can answer directly.\n"
            "Final Answer: ambient chillout lofi jazz dreamy peaceful soft"
        )

        agent = AIAgent(verbose=False)
        agent.deepseek = mock_instance
        result = agent.run("relaxing music")

        assert "ambient" in result
        mock_instance.generate.assert_called_once()

    @patch("app.services.ai.ai_agent.web_search")
    @patch("app.services.ai.ai_agent.DeepSeekClient")
    def test_performs_web_search_then_answers(self, MockClient, mock_search):
        """Should use web_search and then produce a Final Answer."""
        mock_instance = MockClient.return_value

        # First call: agent wants to search
        # Second call: agent gives final answer
        mock_instance.generate.side_effect = [
            "Thought: I need to search.\nAction: web_search\nAction Input: Harry Potter themes",
            "Thought: I found the info.\nFinal Answer: fantasy orchestral cinematic epic medieval ambient dream"
        ]
        mock_search.return_value = "Harry Potter is known for its magical atmosphere."

        agent = AIAgent(verbose=False)
        agent.deepseek = mock_instance
        result = agent.run("music for Harry Potter")

        assert "fantasy" in result
        mock_search.assert_called_once_with("Harry Potter themes")

    @patch("app.services.ai.ai_agent.web_search")
    @patch("app.services.ai.ai_agent.DeepSeekClient")
    def test_limits_web_search_to_max(self, MockClient, mock_search):
        """Should stop calling web_search after MAX_WEB_SEARCH times."""
        mock_instance = MockClient.return_value

        # Agent always wants to search
        search_responses = [
            "Thought: Need more.\nAction: web_search\nAction Input: query"
        ] * (MAX_WEB_SEARCH + 2)
        mock_instance.generate.side_effect = search_responses
        mock_search.return_value = "Some result"

        agent = AIAgent(verbose=False)
        agent.deepseek = mock_instance
        result = agent.run("test prompt")

        # web_search should be called at most MAX_WEB_SEARCH times
        assert mock_search.call_count <= MAX_WEB_SEARCH

    @patch("app.services.ai.ai_agent.DeepSeekClient")
    def test_stops_after_max_iterations(self, MockClient):
        """Should return fallback after MAX_ITERATIONS."""
        mock_instance = MockClient.return_value
        # Agent only returns thoughts, never a final answer or action
        mock_instance.generate.return_value = "Thought: I am still thinking about this."

        agent = AIAgent(verbose=False)
        agent.deepseek = mock_instance
        result = agent.run("impossible question")

        # Should have been called MAX_ITERATIONS times
        assert mock_instance.generate.call_count == MAX_ITERATIONS
        assert isinstance(result, str)

    @patch("app.services.ai.ai_agent.DeepSeekClient")
    def test_handles_deepseek_error_gracefully(self, MockClient):
        """Should raise RuntimeError on DeepSeek API error."""
        mock_instance = MockClient.return_value
        mock_instance.generate.side_effect = RuntimeError("API error")

        agent = AIAgent(verbose=False)
        agent.deepseek = mock_instance

        with pytest.raises(RuntimeError, match="DeepSeek generation failed"):
            agent.run("test prompt")


class TestAIExecutor:
    """Tests for the ai_executor function."""

    @patch("app.services.ai.ai_executor.AI_AGENT")
    def test_returns_filtered_tags(self, mock_agent):
        """Should return tags from the agent response (already filtered by agent)."""
        mock_agent.run.return_value = (
            "rock blues jazz funk soul indie pop"
        )
        result = ai_executor("I want rock music")
        assert result == "rock blues jazz funk soul indie pop"

    @patch("app.services.ai.ai_executor.AI_AGENT")
    def test_truncates_excess_tags(self, mock_agent):
        """Should pass through tags from agent (agent handles truncation)."""
        mock_agent.run.return_value = (
            "tag1 tag2 tag3 tag4 tag5 tag6 tag7"
        )
        result = ai_executor("whatever")
        tags = result.split()
        assert len(tags) == 7

    @patch("app.services.ai.ai_executor.AI_AGENT")
    def test_handles_empty_agent_response(self, mock_agent):
        """Should handle empty response from agent."""
        mock_agent.run.return_value = ""
        result = ai_executor("test")
        assert result == ""
