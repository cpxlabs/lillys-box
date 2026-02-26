"""
Custom pipeline for processing Pet Care Game analytics.

This module contains custom transformations and processors
for game event data.
"""

import json
from typing import Any, Dict, List
from datetime import datetime


class GameEventProcessor:
    """Process game events for analytics."""

    def __init__(self):
        self.events = []

    def parse_event(self, event: Dict[str, Any]) -> Dict[str, Any]:
        """Parse and validate a game event."""
        required_fields = ["user_id", "event_type", "timestamp"]

        for field in required_fields:
            if field not in event:
                raise ValueError(f"Missing required field: {field}")

        # Add processing timestamp
        event["processed_at"] = datetime.utcnow().isoformat()

        return event

    def filter_pet_interactions(self, events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Filter events to only pet interactions."""
        interaction_types = [
            "pet_feed",
            "pet_play",
            "pet_bath",
            "pet_vet",
            "pet_sleep",
            "pet_wardrobe"
        ]

        return [
            event for event in events
            if event.get("event_type") in interaction_types
        ]

    def aggregate_by_user(self, events: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Aggregate events by user."""
        user_stats = {}

        for event in events:
            user_id = event.get("user_id")
            if user_id not in user_stats:
                user_stats[user_id] = {
                    "user_id": user_id,
                    "total_events": 0,
                    "event_types": {},
                    "first_event": event.get("timestamp"),
                    "last_event": event.get("timestamp")
                }

            stats = user_stats[user_id]
            stats["total_events"] += 1

            event_type = event.get("event_type")
            if event_type not in stats["event_types"]:
                stats["event_types"][event_type] = 0
            stats["event_types"][event_type] += 1

            # Update last event
            if event.get("timestamp") > stats["last_event"]:
                stats["last_event"] = event.get("timestamp")

        return user_stats


def transform_pet_stats(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Transform raw pet stats into analytics format.

    This is an example transformation function that can be
    referenced in config.yml.
    """
    return {
        "pet_id": data.get("id"),
        "pet_name": data.get("name"),
        "pet_type": data.get("type"),
        "happiness_avg": data.get("happiness", 0),
        "health_avg": data.get("health", 0),
        "last_interaction": data.get("lastFed") or data.get("lastPlayed"),
    }


if __name__ == "__main__":
    # Example usage
    processor = GameEventProcessor()

    sample_events = [
        {
            "user_id": "user123",
            "event_type": "pet_feed",
            "timestamp": "2025-02-24T10:00:00Z",
            "pet_id": "pet456",
            "food_type": "kibble"
        },
        {
            "user_id": "user123",
            "event_type": "pet_play",
            "timestamp": "2025-02-24T10:30:00Z",
            "pet_id": "pet456",
            "activity": "yarn_ball"
        }
    ]

    # Process events
    filtered = processor.filter_pet_interactions(sample_events)
    aggregated = processor.aggregate_by_user(filtered)

    print(json.dumps(aggregated, indent=2))
