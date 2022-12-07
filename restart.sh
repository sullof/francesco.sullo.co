#!/usr/bin/env bash

git pull
pnpm i
pnpm build
docker/node.sh

