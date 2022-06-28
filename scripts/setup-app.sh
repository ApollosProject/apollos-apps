if [ -z "$CHURCH" ] || [ -z "$APOLLOS_API_KEY" ]; then
    echo "CHURCH and APOLLOS_API_KEY required!"
    exit 1
fi

API_URL="https://apollos-cluster-production.herokuapp.com/api"
APP=$(curl -s --fail -H "x-api-key: $APOLLOS_API_KEY" -H "accept: text/plain" "$API_URL/config/$CHURCH/APP.NAME")
IOS_BUNDLE=$(curl -s --fail -H "x-api-key: $APOLLOS_API_KEY" -H "accept: text/plain" "$API_URL/config/$CHURCH/APP.APPLE_BUNDLE_ID")
ANDROID_BUNDLE=$(curl -s --fail -H "x-api-key: $APOLLOS_API_KEY" -H "accept: text/plain" "$API_URL/config/$CHURCH/APP.ANDROID_PKG_ID")
SERVER_URL=$(curl -s --fail -H "x-api-key: $APOLLOS_API_KEY" -H "accept: text/plain" "$API_URL/config/$CHURCH/APP.SERVER_URL")
GOOGLE_MAPS_KEY=$(curl -s --fail -H "x-api-key: $APOLLOS_API_KEY" -H "accept: text/plain" "$API_URL/config/$CHURCH/APP_GOOGLE_MAPS_API_KEY")

rm -rf "deploys/mobile/$CHURCH"
mkdir -p "deploys/mobile/$CHURCH"
cp -r templates/mobile/* "deploys/mobile/$CHURCH"
cd "deploys/mobile/$CHURCH" || exit 1

# Add latest NPM versions
DEPSLINE=$(grep -n "dependencies" package.json | sed -E "s/^([0-9]+):.*/\1/g")
DEVDEPSLINE=$(grep -n "devDependencies" package.json | sed -E "s/^([0-9]+):.*/\1/g")
JSON=$(sed -E "s/^.*\"(@apollosproject\/[a-z\-]+)\".*/\1 /g" package.json)
PKGS=$(echo "$JSON" | sed -n "$DEPSLINE","$DEVDEPSLINE"p | grep "@apollosproject" | tr -d "\n")
DEVPKGS=$(echo "$JSON" | sed -n "$DEVDEPSLINE",/^$/p | grep "@apollosproject" | tr -d "\n")

# clean up dependencies
yarn remove $PKGS $DEVPKGS @carimus/metro-symlinked-deps --ignore-scripts
rm metro.config.js
yarn add $PKGS --ignore-scripts
yarn add --dev $DEVPKGS --ignore-scripts
yarn add --dev @apollosproject/react-native-make # problem with the sharp module not installing properly the first time

rm -rf fastlane
mkdir fastlane

CLEAN_APP=$(echo "$APP" | tr -d '[:space:]')
npx react-native-rename "$CLEAN_APP" -b "$ANDROID_BUNDLE"

sed -i "" -E "s/Apollos Church/$APP/g" app.json
sed -i "" -E "s/Apollos Church/$APP/g" "ios/$CLEAN_APP/Info.plist"
sed -i "" -E "s/Apollos Church/$APP/g" android/app/src/main/res/values/strings.xml
sed -i "" -E "s/com\.differential\.apollos/$IOS_BUNDLE/g" "ios/$CLEAN_APP/$CLEAN_APP.entitlements"
sed -i "" -E "s/com\.differential\.apollos/$IOS_BUNDLE/g" ios/OneSignalNotificationServiceExtension/OneSignalNotificationServiceExtension.entitlements
sed -i "" -E "s/com\.differential\.apollos/$IOS_BUNDLE/g" "ios/$CLEAN_APP.xcodeproj/project.pbxproj"
sed -i "" -E "s/DEVELOPMENT_TEAM = \w+;/DEVELOPMENT_TEAM = \"\";/g" "ios/$CLEAN_APP.xcodeproj/project.pbxproj"

rm "ios/$CLEAN_APP.xcworkspace/xcshareddata/xcschemes/apolloschurchapp.xcscheme"

echo "APP_DATA_URL=$SERVER_URL
GOOGLE_MAPS_API_KEY=$GOOGLE_MAPS_KEY" >.env

yarn
APP_DATA_URL=$SERVER_URL node scripts/get-introspection-data.js
