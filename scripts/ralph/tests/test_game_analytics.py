"""Tests for game analytics pipeline."""

import pytest
from pipelines.game_analytics import GameEventProcessor, transform_pet_stats


class TestGameEventProcessor:
    """Test GameEventProcessor class."""

    def test_parse_event_valid(self):
        """Test parsing a valid event."""
        processor = GameEventProcessor()
        event = {
            "user_id": "user123",
            "event_type": "pet_feed",
            "timestamp": "2025-02-24T10:00:00Z"
        }
        result = processor.parse_event(event)

        assert result["user_id"] == "user123"
        assert result["event_type"] == "pet_feed"
        assert "processed_at" in result

    def test_parse_event_missing_field(self):
        """Test parsing event with missing required field."""
        processor = GameEventProcessor()
        event = {
            "user_id": "user123",
            "event_type": "pet_feed"
            # Missing timestamp
        }

        with pytest.raises(ValueError, match="Missing required field"):
            processor.parse_event(event)

    def test_filter_pet_interactions(self):
        """Test filtering pet interaction events."""
        processor = GameEventProcessor()
        events = [
            {"event_type": "pet_feed", "user_id": "user123"},
            {"event_type": "user_login", "user_id": "user123"},
            {"event_type": "pet_play", "user_id": "user123"},
            {"event_type": "purchase", "user_id": "user123"},
        ]

        filtered = processor.filter_pet_interactions(events)

        assert len(filtered) == 2
        assert all(e["event_type"] in ["pet_feed", "pet_play"] for e in filtered)

    def test_aggregate_by_user(self):
        """Test aggregating events by user."""
        processor = GameEventProcessor()
        events = [
            {
                "user_id": "user123",
                "event_type": "pet_feed",
                "timestamp": "2025-02-24T10:00:00Z"
            },
            {
                "user_id": "user123",
                "event_type": "pet_play",
                "timestamp": "2025-02-24T11:00:00Z"
            },
            {
                "user_id": "user456",
                "event_type": "pet_feed",
                "timestamp": "2025-02-24T10:30:00Z"
            },
        ]

        result = processor.aggregate_by_user(events)

        assert "user123" in result
        assert "user456" in result
        assert result["user123"]["total_events"] == 2
        assert result["user456"]["total_events"] == 1
        assert result["user123"]["event_types"]["pet_feed"] == 1
        assert result["user123"]["event_types"]["pet_play"] == 1


class TestTransformPetStats:
    """Test transform_pet_stats function."""

    def test_transform_basic(self):
        """Test basic transformation of pet stats."""
        data = {
            "id": "pet123",
            "name": "Fluffy",
            "type": "cat",
            "happiness": 85,
            "health": 90,
            "lastFed": "2025-02-24T10:00:00Z"
        }

        result = transform_pet_stats(data)

        assert result["pet_id"] == "pet123"
        assert result["pet_name"] == "Fluffy"
        assert result["pet_type"] == "cat"
        assert result["happiness_avg"] == 85
        assert result["health_avg"] == 90
        assert result["last_interaction"] == "2025-02-24T10:00:00Z"

    def test_transform_missing_fields(self):
        """Test transformation with missing optional fields."""
        data = {
            "id": "pet123",
            "name": "Fluffy",
            "type": "cat"
        }

        result = transform_pet_stats(data)

        assert result["pet_id"] == "pet123"
        assert result["happiness_avg"] == 0
        assert result["health_avg"] == 0
        assert result["last_interaction"] is None
