#! /usr/bin/env bash
  curl -s -X POST \
   -H "Content-Type: application/json" \
   -H "Accept: application/json" \
   -H "Travis-API-Version: 3" \
   -H "Authorization: token NgwCFMqRYxaqurXAeNu50Q" \
   -d '{ "quiet": true }' \
   https://api.travis-ci.org/job/2535.4/debug
