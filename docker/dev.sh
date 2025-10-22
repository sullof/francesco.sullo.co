#!/usr/bin/env bash

# Build the custom development image
echo "Building custom development image..."
docker build -f Dockerfile.dev -t sullo-co-dev .

# Run the development container
echo "Starting development container..."
source .env && docker run -it --rm \
  --name sullo-co-dev \
  -p 9050 \
  -v $PWD/log:/var/log/sullo-co \
  --link some-postgres:postgres \
  -e POSTGRES_HOST=postgres \
  -e POSTGRES_PORT=5432 \
  -e POSTGRES_USER=$POSTGRES_USER \
  -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
  -e POSTGRES_DB=$POSTGRES_DB \
  -e NODE_ENV=development \
  -e VIRTUAL_HOST=sullo.co.local \
  sullo-co-dev
