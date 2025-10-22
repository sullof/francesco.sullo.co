#!/usr/bin/env bash

# Development update script
# This script handles the complete development cycle when changes are made

set -e  # Exit on any error

echo "🔄 Starting development update cycle..."

# Step 1: Update dependencies
echo "📦 Installing/updating dependencies..."
pnpm install

# Step 2: Run migrations
echo "🗄️  Running database migrations..."
docker exec some-postgres psql -U postgres -d hooq -c "SELECT 1;" > /dev/null 2>&1 || {
    echo "❌ Database not accessible. Make sure PostgreSQL container is running."
    exit 1
}

# Run migrations if the container is running
if docker ps | grep -q "sullo-co-dev"; then
    echo "Running migrations via container..."
    docker exec sullo-co-dev node scripts/run-migrations.js
else
    echo "Running migrations directly..."
    node scripts/run-migrations.js
fi

# Step 3: Build Docker image
echo "🐳 Building Docker image..."
docker build -f Dockerfile.dev -t sullo-co-dev .

# Step 4: Restart existing container
echo "🔄 Restarting container..."
if docker ps | grep -q "sullo-co-dev"; then
    docker restart sullo-co-dev
    echo "✅ Container restarted!"
else
    echo "⚠️  Container not running. Start it with: docker/dev.sh"
fi
