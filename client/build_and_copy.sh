#!/bin/sh

echo "Compiling React app"
npm run build

echo "Cleaning api/web folder"
rm -r ../api/web/*

echo "Copying content from build to api/web"
cp -r ./build/* ../api/web