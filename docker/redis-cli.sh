#!/usr/bin/env bash

docker run -it \
  --link redis-local:redis \
  --rm redis redis-cli -h redis -p 6379
