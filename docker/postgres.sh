#!/usr/bin/env bash

docker run -d \
    --name some-postgres \
    -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
    -e POSTGRES_USER=$POSTGRES_USER
    -e POSTGRES_DB=$POSTGRES_DB
    -e PGDATA=/var/lib/postgresql/data/pgdata \
    -v /vol/data/pg:/var/lib/postgresql/data \
    postgres
