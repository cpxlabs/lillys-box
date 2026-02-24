#!/bin/bash
# Setup script for Ralph development environment

set -e

echo "🚀 Setting up Ralph environment for Pet Care Game..."

# Create data directories
echo "📁 Creating data directories..."
mkdir -p data/events data/users output

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ Created .env - please update with your settings"
else
    echo "⚠️  .env already exists, skipping..."
fi

# Create sample data
echo "📊 Creating sample data..."
cat > data/events/sample.json << 'EOF'
{"user_id": "user123", "event_type": "pet_feed", "timestamp": "2025-02-24T10:00:00Z", "pet_id": "pet456", "food_type": "kibble"}
{"user_id": "user123", "event_type": "pet_play", "timestamp": "2025-02-24T10:30:00Z", "pet_id": "pet456", "activity": "yarn_ball"}
{"user_id": "user456", "event_type": "pet_bath", "timestamp": "2025-02-24T11:00:00Z", "pet_id": "pet789", "duration": 120}
EOF

cat > data/users/sample.csv << 'EOF'
user_id,username,created_at,pets_owned
user123,john_doe,2025-01-15T08:00:00Z,1
user456,jane_smith,2025-02-01T09:30:00Z,2
EOF

echo "✅ Sample data created"

# Install dependencies if not in container
if [ ! -f /.dockerenv ] && [ ! -f /run/.containerenv ]; then
    echo "📦 Installing Python dependencies..."
    if command -v python3 &> /dev/null; then
        python3 -m pip install -r requirements.txt
        echo "✅ Dependencies installed"
    else
        echo "⚠️  Python 3 not found. Please install Python 3.11+ or use Dev Container"
    fi
else
    echo "🐳 Running in container, dependencies should already be installed"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Update .env with your configuration"
echo "  2. Validate config: ralph validate config.yml"
echo "  3. Run sample pipeline: ralph run config.yml --pipeline process_events"
echo "  4. Check the README.md for more commands"
echo ""
