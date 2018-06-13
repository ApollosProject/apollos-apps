#! /bin/bash

set -e

DIR="$(pwd)"
MOBILE_DIR="$DIR/mobile"

# Move Master to Release Branch to trigger App Builds on App Center
current_branch() {
  git symbolic-ref --short HEAD
}

saved_branch=$(current_branch)

if [ "${saved_branch}" != "master" ]; then
   git checkout "master"
fi

git pull origin master
