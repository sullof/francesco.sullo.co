#!/usr/bin/env bash

docker stop sullo-co-debug
docker rm sullo-co-debug

docker stop sullo-co
docker rm sullo-co

source .default.env &&docker run -d \
  --name sullo-co \
  --link redis-local:redis \
  -p 9050 \
  --restart unless-stopped \
  -v $PWD:/usr/src/app \
  -v /vol/log/sullo-co_app:/var/log/sullo-co_app \
  -e NODE_ENV=production \
  -e VIRTUAL_HOST=francesco.sullo.co,www.sullo.co \
  -e LETSENCRYPT_HOST=francesco.sullo.co,www.sullo.co \
  -e LETSENCRYPT_EMAIL=admin@sullo.co \
  -w /usr/src/app node:carbon npm run start

