#!/usr/bin/env bash

source docker/.default.env && docker run -it --rm \
  --name sullo-co-dev \
  --link redis-local:redis \
  -p 9050:9050 \
  -v $PWD:/usr/src/app \
  -v $PWD/log:/var/log/sullo-co_app \
  -e VIRTUAL_HOST=valeria \
  -w /usr/src/app node:6 npm test

