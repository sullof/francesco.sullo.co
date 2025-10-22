#!/usr/bin/env bash

# Stop and remove container only if it exists
docker stop some-postgres 2>/dev/null || true
docker rm some-postgres 2>/dev/null || true

source .env && docker run -d \
    --name some-postgres \
    --restart unless-stopped \
    -p 5432:5432 \
    -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
    -e POSTGRES_USER=$POSTGRES_USER \
    -e POSTGRES_DB=$POSTGRES_DB \
    -e PGDATA=/var/lib/postgresql/data/pgdata \
    -v postgres-data:/var/lib/postgresql/data \
    postgres
