#!/usr/bin/env bash

# Build the custom production image
echo "Building custom production image..."
docker build -f Dockerfile -t sullo-co .

# Stop and remove existing container
docker stop sullo-co 2>/dev/null || true
docker rm sullo-co 2>/dev/null || true

# Run the production container
echo "Starting production container..."
source .env && docker run -d \
  --name sullo-co \
  --link some-postgres:postgres \
  -p 9050 \
  --restart unless-stopped \
  -v /vol/log/sullo-co_app:/var/log/sullo-co_app \
  -e NODE_ENV=production \
  -e POSTGRES_HOST=postgres \
  -e POSTGRES_PORT=5432 \
  -e POSTGRES_USER=$POSTGRES_USER \
  -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
  -e POSTGRES_DB=$POSTGRES_DB \
  -e VIRTUAL_HOST=sullo.co,www.sullo.co,francesco.sullo.co,www.francesco.sullo.co \
  -e LETSENCRYPT_HOST=sullo.co,www.sullo.co,francesco.sullo.co,www.francesco.sullo.co \
  -e LETSENCRYPT_EMAIL=francesco@sullo.co \
  sullo-co

