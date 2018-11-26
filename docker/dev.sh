#!/usr/bin/env bash

source .default.env && docker run -it --rm \
  --name sullo-co-dev \
  --link redis-local:redis \
  -p 9050 \
  -v $PWD:/usr/src/app \
  -v $PWD/log:/var/log/sullo-co \
  -e NODE_ENV=development \
  -e VIRTUAL_HOST=francesco.sullo.co.localhost,www.sullo.co.localhost,www.francesco.sullo.co.localhost,sullo.co.localhost \
  -w /usr/src/app node:carbon npm run start
