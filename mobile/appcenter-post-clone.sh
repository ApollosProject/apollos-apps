#!/usr/bin/env bash
set -e

echo $(pwd)
touch .env

echo "Is it working?"
echo $APPCENTER_SOURCE_DIRECTORY

echo "APP_DATA_URL=apollos-church-api.now.sh" > .env

cat .env
