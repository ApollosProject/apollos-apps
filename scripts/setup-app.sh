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
THEME=$(curl -s --fail -H "x-api-key: $APOLLOS_API_KEY" -H "accept: text/plain" "$API_URL/config/$CHURCH/APP.THEME")

rm -rf deploys/mobile
cp -r templates/mobile deploys/mobile

cd deploys/mobile || exit 1

rm -rf fastlane
mkdir fastlane

printf $THEME > theme.json

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
