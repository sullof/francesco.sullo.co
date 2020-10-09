#!/usr/bin/env bash

git pull origin master && npm run build && docker/node.sh
