"""
Integration tests for the Deals API (POST /api/deals/, GET list, duplicate handling).
LLM is mocked so tests run without Gemini.
"""
import pytest
from unittest.mock import patch
from django.urls import reverse
from api.models import Deal


@pytest.mark.django_db
class TestDealsAPI:
    """Deals API integration tests."""

    def test_create_deal_success(self, api_client, mock_llm_briefer):
        """POST with valid raw_text creates a deal and returns 201 with the deal."""
        with patch("api.views.DealLLMBriefer", return_value=mock_llm_briefer):
            response = api_client.post(
                "/api/deals/",
                {"raw_text": "Unique deal text for test 123."},
                format="json",
            )
        assert response.status_code == 201
        data = response.json()
        assert data["raw_text"] == "Unique deal text for test 123."
        assert data["status"] == "processed"
        assert "id" in data
        assert data["extracted_json"] == {
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
        assert Deal.objects.count() == 1
        deal = Deal.objects.get()
        assert deal.input_hash
        assert len(deal.input_hash) == 64

    def test_list_deals(self, api_client, mock_llm_briefer):
        """GET /api/deals/ returns list of deals."""
        with patch("api.views.DealLLMBriefer", return_value=mock_llm_briefer):
            api_client.post(
                "/api/deals/",
                {"raw_text": "First deal."},
                format="json",
            )
            api_client.post(
                "/api/deals/",
                {"raw_text": "Second deal."},
                format="json",
            )
        response = api_client.get("/api/deals/")
        assert response.status_code == 200
        data = response.json()
        assert "results" in data
        assert len(data["results"]) == 2
        raw_texts = {r["raw_text"] for r in data["results"]}
        assert raw_texts == {"First deal.", "Second deal."}

    def test_create_duplicate_raw_text_returns_400(self, api_client, mock_llm_briefer):
        """Posting the same raw_text twice returns 400 on second request (duplicate input_hash)."""
        raw = "Same deal text."
        with patch("api.views.DealLLMBriefer", return_value=mock_llm_briefer):
            first = api_client.post("/api/deals/", {"raw_text": raw}, format="json")
        assert first.status_code == 201
        with patch("api.views.DealLLMBriefer", return_value=mock_llm_briefer):
            second = api_client.post("/api/deals/", {"raw_text": raw}, format="json")
        assert second.status_code == 400
        assert "error" in second.json()
        assert Deal.objects.count() == 1

    def test_create_duplicate_normalized_text_returns_400(
        self, api_client, mock_llm_briefer
    ):
        """Different whitespace/case but same normalized text is treated as duplicate."""
        with patch("api.views.DealLLMBriefer", return_value=mock_llm_briefer):
            first = api_client.post(
                "/api/deals/",
                {"raw_text": "  Same  DEAL  text.  "},
                format="json",
            )
        assert first.status_code == 201
        with patch("api.views.DealLLMBriefer", return_value=mock_llm_briefer):
            second = api_client.post(
                "/api/deals/",
                {"raw_text": "same deal text."},
                format="json",
            )
        assert second.status_code == 400
        assert Deal.objects.count() == 1

    def test_create_missing_raw_text_returns_400(self, api_client):
        """POST without raw_text returns 400."""
        response = api_client.post("/api/deals/", {}, format="json")
        assert response.status_code == 400
        assert "error" in response.json() or "raw_text" in str(response.json())
