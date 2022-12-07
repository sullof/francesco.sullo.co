#!/usr/bin/env bash

git fetch --all
git reset --hard origin/master
pnpm install
pnpm build
docker/node.sh

