#!/usr/bin/env bash
set -e

touch $APPCENTER_SOURCE_DIRECTORY/.env

echo "Is it working?"
echo $APPCENTER_SOURCE_DIRECTORY

echo "APP_DATA_URL=apollos-church-api.now.sh" > $APPCENTER_SOURCE_DIRECTORY/.env

echo $APPCENTER_SOURCE_DIRECTORY/.env
