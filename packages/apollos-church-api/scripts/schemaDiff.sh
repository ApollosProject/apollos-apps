#!/usr/bin/env bash

./node_modules/.bin/get-graphql-schema https://apollos-church-api-herokuapp-com.global.ssl.fastly.net > prod.graphql
DIFF=$(graphql-findbreakingchanges prod.graphql schema.graphql)
rm prod.graphql
echo "$DIFF"

if [[ $DIFF = *"BREAKING CHANGES"* ]]
then
  exit 1
fi
