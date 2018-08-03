#!/bin/bash

set -e

cd ..

# Declare variables
currentVersion=$(cd mobile && node -p "require('./package.json').version")
version=$1
dir=$(pwd)
mobileDIR=$dir/mobile
apiDIR=$dir/api
androidDIR=$dir/mobile/android
iosDIR=$dir/mobile/ios

# Update android build.gradle to new version
sed -i "" -e "s/versionName \"$currentVersion\"/versionName \"$version\"/g" $androidDIR/app/build.gradle

# Update ios to new version
cd $iosDIR && xcrun agvtool new-marketing-version $1

# Mobile and API package.json update with changelog generation
cd $mobileDIR && yarn run release
cd $apiDIR && yarn run release

cd $dir

# Merge Mobile and API changelogs into one
awk '{if (!a[$0]++) print}' $mobileDIR/CHANGELOG.md $apiDIR/CHANGELOG.md > CHANGELOG.md

# Remove Mobile and API changelogs
rm -f $mobileDIR/CHANGELOG.md $apiDIR/CHANGELOG.md

# Commit
git add .
git commit -m "feat: updated api, mobile, android, and ios to v${version}"
