#!/bin/bash

set -e

cd ..
currentVersion=$(cd mobile && node -p "require('./package.json').version")
version=$1
dir=$(pwd)
mobileDIR=$dir/mobile
androidDIR=$dir/mobile/android
iosDIR=$dir/mobile/ios

sed -i ".backup" "s/versionName "${currentVersion}"/versionName "${version}"/g" $androidDIR/app/build.gradle

cd $iosDIR xcrun agvtool new-marketing-version $1

cd $mobileDIR && yarn run release
