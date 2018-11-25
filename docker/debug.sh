#!/usr/bin/env bash

docker stop sullo-co-debug
docker rm sullo-co-debug

docker stop sullo-co
docker rm sullo-co

source .default.env && docker run -it \
  --name sullo-co-debug \
  --link redis-local:redis \
  -p 9050 \
  -v $PWD:/usr/src/app \
  -v /vol/log/sullo-co_dapp:/var/log/sullo-co_dapp \
  -e VIRTUAL_HOST=francesco.sullo.co,www.sullo.co \
  -e LETSENCRYPT_HOST=francesco.sullo.co,www.sullo.co \
  -e LETSENCRYPT_EMAIL=admin@sullo.co \
  -w /usr/src/app node:carbon npm run start

