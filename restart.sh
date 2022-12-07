#!/usr/bin/env bash

git fetch --all
git reset --hard origin/master
pnpm i
pnpm build
docker/node.sh

