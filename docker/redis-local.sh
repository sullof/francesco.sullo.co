#!/usr/bin/env bash

# this allow to run the server locally as
#    node index.js --redis-local

docker run \
  --name redis-local \
  -p 6379:6379 \
  --restart unless-stopped \
  -v /Users/sullof/vol/data/redis-local:/data \
  -d redis redis-server --appendonly yes

