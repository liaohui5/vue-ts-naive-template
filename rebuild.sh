#!/bin/bash

if [[ -d "./build" ]]; then
  rm -rf "./build"
fi

if [[ -f "./build.zip" ]]; then
  rm -rf "./build.zip"
fi

mkdir "./build"

npm run build

mv dist ./build/

cp -r Dockerfile docker-compose.yaml README.md ./build

zip ./build.zip -r ./build
