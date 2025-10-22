#!/usr/bin/env bash

# Quick restart script for development
# Use this when you only need to restart the container without rebuilding

set -e

echo "🔄 Quick restarting development container..."

# Restart existing container
echo "🔄 Restarting container..."
if docker ps | grep -q "sullo-co-dev"; then
    docker restart sullo-co-dev
    echo "✅ Container restarted!"
else
    echo "⚠️  Container not running. Start it with: docker/dev.sh"
fi
