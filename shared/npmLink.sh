#!/usr/bin/env bash

# @NOTE: No longer necessary because of vite.config.dev.ts aliasing straight into /shared
# mkdir -p ../node_modules/@rhyeen
# rm -rf ../node_modules/@rhyeen/cozy-ttrpg-shared
# ln -sfn "$(pwd)" ../node_modules/@rhyeen/cozy-ttrpg-shared

mkdir -p ../functions/node_modules/@rhyeen
rm -rf ../functions/node_modules/@rhyeen/cozy-ttrpg-shared
ln -sfn "$(pwd)" ../functions/node_modules/@rhyeen/cozy-ttrpg-shared

echo "Shared is linked to functions NOT app"
