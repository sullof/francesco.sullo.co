#!/usr/bin/env bash

host=sullo-co

if [[ $1 != '' ]]; then
  host=$1
fi

docker exec -it $host bash
