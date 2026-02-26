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


class TestRunLoop:
    """Test GameEventProcessor.run_loop method."""

    def _make_event(self, user_id: str = "user1", event_type: str = "pet_feed", ts: str = "2025-02-24T10:00:00Z"):
        return {"user_id": user_id, "event_type": event_type, "timestamp": ts}

    def test_run_loop_processes_up_to_limit(self):
        """Loop stops after processing exactly `limit` events."""
        processor = GameEventProcessor()
        for i in range(5):
            processor.add_event(self._make_event(user_id=f"user{i}"))

        result = processor.run_loop(limit=3)

        assert result["processed"] == 3
        assert result["limit_reached"] is True
        assert len(result["events"]) == 3

    def test_run_loop_processes_all_when_under_limit(self):
        """Loop processes all events when fewer than limit exist."""
        processor = GameEventProcessor()
        for i in range(2):
            processor.add_event(self._make_event(user_id=f"user{i}"))

        result = processor.run_loop(limit=10)

        assert result["processed"] == 2
        assert result["limit_reached"] is False
        assert len(result["events"]) == 2

    def test_run_loop_skips_invalid_events(self):
        """Loop skips malformed events and continues counting valid ones."""
        processor = GameEventProcessor()
        processor.add_event({"user_id": "user1", "event_type": "pet_feed"})  # missing timestamp
        processor.add_event(self._make_event(user_id="user2"))
        processor.add_event(self._make_event(user_id="user3"))

        result = processor.run_loop(limit=2)

        assert result["processed"] == 2
        assert result["limit_reached"] is True
        # Only the two valid events are in results
        assert all("processed_at" in e for e in result["events"])

    def test_run_loop_empty_queue(self):
        """Loop on an empty queue returns zero processed events."""
        processor = GameEventProcessor()
        result = processor.run_loop(limit=5)

        assert result["processed"] == 0
        assert result["limit_reached"] is False
        assert result["events"] == []

    def test_run_loop_invalid_limit_raises(self):
        """Passing a non-positive limit raises ValueError."""
        processor = GameEventProcessor()
        with pytest.raises(ValueError):
            processor.run_loop(limit=0)

    def test_add_event_appends_to_queue(self):
        """add_event stores events in self.events."""
        processor = GameEventProcessor()
        processor.add_event(self._make_event())
        processor.add_event(self._make_event(user_id="user2"))

        assert len(processor.events) == 2


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
