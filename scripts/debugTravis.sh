#! /usr/bin/env bash

# TOKEN comes from your settings page
# JOB_ID comes from the url of a job in Travis.
curl -s -X POST \
 -H "Content-Type: application/json" \
 -H "Accept: application/json" \
 -H "Travis-API-Version: 3" \
 -H "Authorization: token ${TRAVIS_TOKEN}" \
 -d '{ "quiet": true }' \
 https://api.travis-ci.org/job/"${TRAVIS_JOB_ID}"/debug
