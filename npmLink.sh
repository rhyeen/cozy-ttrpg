#!/usr/bin/env bash

cd node_modules/@pocketrn

rm -rf $1

ln -sf ../../../$1

echo "Created a symlink of node_modules/@pocketrn/$1 to ../$1"

cd ../..
