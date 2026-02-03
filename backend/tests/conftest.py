"""
Pytest fixtures for integration tests.
Uses pytest-django (db fixture, client); LLM is mocked so no real API calls.
"""
import pytest
from unittest.mock import MagicMock, patch
from services.interfaces.brief_generator import DealBriefResult


# Minimal valid extracted JSON matching DealBriefSchema for mock responses
SAMPLE_EXTRACTED_JSON = {
    "investment_brief": [f"Point {i}" for i in range(1, 11)],
    "entities": {
        "company": "TestCo",
        "founders": ["Alice", "Bob"],
        "sector": "fintech",
        "geography": "US",
        "stage": "Series A",
        "round_size_usd": 5_000_000.0,
        "notable_metrics": ["ARR 2M"],
    },
    "tags": {
        "category": ["fintech"],
        "stage": "Series A",
    },
}


@pytest.fixture
def mock_llm_briefer():
    """Mock DealLLMBriefer so generate_brief returns success without calling Gemini."""
    mock = MagicMock()
    mock.generate_brief.return_value = DealBriefResult(
        success=True,
        data=SAMPLE_EXTRACTED_JSON,
    )
    return mock


@pytest.fixture
def api_client():
    """DRF API test client."""
    from rest_framework.test import APIClient
    return APIClient()
