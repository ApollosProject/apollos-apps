#! /bin/bash

set -e

DIR="$(pwd)"
MOBILE_DIR="$DIR/mobile"
TAG=$1
MSG=$2

# Get current branch
current_branch() {
  git symbolic-ref --short HEAD
}
saved_branch=$(current_branch)

# If current branch isn't master, switch to it
if [ "${saved_branch}" != "master" ]; then
   git checkout "master"
fi

# Merge master into mobile-release branch
git pull origin master
git checkout mobile-release
git merge "master"

# Create Tag and Push
git tag -a $TAG -m "${MSG}"
git push --tags
