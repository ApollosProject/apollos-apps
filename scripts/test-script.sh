#!/bin/bash
set -e
if [ -z "$1" ]; then
  npm run run-with-settings './node_modules/.bin/jest'
else
  npm run run-with-settings './node_modules/.bin/jest --maxWorkers=2'
fi
