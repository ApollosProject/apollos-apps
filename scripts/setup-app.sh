if [ -z "$CHURCH" ] || [ -z "$APOLLOS_API_KEY" ]; then
    echo "CHURCH and APOLLOS_API_KEY required!"
    exit 1
fi

API_URL="https://apollos-cluster-production.herokuapp.com/api"
APP=$(curl -s --fail -H "x-api-key: $APOLLOS_API_KEY" -H "accept: text/plain" "$API_URL/config/$CHURCH/APP.NAME")
ICON=$(curl -s --fail -H "x-api-key: $APOLLOS_API_KEY" -H "accept: text/plain" "$API_URL/config/$CHURCH/APP.ICON_URL")
ICON_BG_COLOR=$(curl -s --fail -H "x-api-key: $APOLLOS_API_KEY" -H "accept: text/plain" "$API_URL/config/$CHURCH/APP.ICON_BG_COLOR")
LOGO=$(curl -s --fail -H "x-api-key: $APOLLOS_API_KEY" -H "accept: text/plain" "$API_URL/config/$CHURCH/APP.LOGO_URL")
WORDMARK=$(curl -s --fail -H "x-api-key: $APOLLOS_API_KEY" -H "accept: text/plain" "$API_URL/config/$CHURCH/APP.WORDMARK_URL")
IOS_BUNDLE=$(curl -s --fail -H "x-api-key: $APOLLOS_API_KEY" -H "accept: text/plain" "$API_URL/config/$CHURCH/APP.APPLE_BUNDLE_ID")
ANDROID_BUNDLE=$(curl -s --fail -H "x-api-key: $APOLLOS_API_KEY" -H "accept: text/plain" "$API_URL/config/$CHURCH/APP.ANDROID_PKG_ID")
SERVER_URL=$(curl -s --fail -H "x-api-key: $APOLLOS_API_KEY" -H "accept: text/plain" "$API_URL/config/$CHURCH/APP.SERVER_URL")
GOOGLE_MAPS_KEY=$(curl -s --fail -H "x-api-key: $APOLLOS_API_KEY" -H "accept: text/plain" "$API_URL/config/$CHURCH/APP_GOOGLE_MAPS_API_KEY")
THEME=$(curl -s --fail -H "x-api-key: $APOLLOS_API_KEY" -H "accept: text/plain" "$API_URL/config/$CHURCH/APP.THEME")
if [ -z "$APP" ] || [ -z "$ICON" ] || [ -z "$ICON_BG_COLOR" ] || [ -z "$LOGO" ] || [ -z "$WORDMARK" ] || [ -z "$IOS_BUNDLE" ] || [ -z "$ANDROID_BUNDLE" ] || [ -z "$SERVER_URL" ] || [ -z "$GOOGLE_MAPS_KEY" ] || [ -z "$THEME" ]; then
    echo "Missing some variables:
    APP.NAME=$APP
    APP.ICON_URL=$ICON
    APP.ICON_BG_COLOR=$ICON_BG_COLOR
    APP.LOGO_URL=$LOGO
    APP.WORDMARK_URL=$WORDMARK
    APP.APPLE_BUNDLE_ID=$IOS_BUNDLE
    APP.ANDROID_PKG_ID=$ANDROID_BUNDLE
    APP.SERVER_URL=$SERVER_URL
    APP_GOOGLE_MAPS_API_KEY=$GOOGLE_MAPS_KEY
    APP.THEME=$THEME"
    exit 1
fi

rm -rf deploys/mobile
cp -r templates/mobile deploys/mobile

cd deploys/mobile || exit 1

rm -rf fastlane
mkdir fastlane

printf $THEME >theme.json

CLEAN_APP=$(echo "$APP" | tr -d '[:space:]')
npx react-native-rename "$CLEAN_APP" -b "$ANDROID_BUNDLE"
SUBDOMAIN=$(echo "$CHURCH" | sed "s/_/-/g")

sed -i "" -E "s/Apollos Church/$APP/g" app.json
sed -i "" -E "s/Apollos Church/$APP/g" "ios/$CLEAN_APP/Info.plist"
sed -i "" -E "s/Apollos Church/$APP/g" android/app/src/main/res/values/strings.xml
sed -i "" -E "s/apollos-demo/$SUBDOMAIN/g" android/app/src/main/AndroidManifest.xml
sed -i "" -E "s/com\.differential\.apollos/$IOS_BUNDLE/g" "ios/$CLEAN_APP/$CLEAN_APP.entitlements"
sed -i "" -E "s/apollos-demo/$SUBDOMAIN/g" "ios/$CLEAN_APP/$CLEAN_APP.entitlements"
sed -i "" -E "s/com\.differential\.apollos/$IOS_BUNDLE/g" ios/OneSignalNotificationServiceExtension/OneSignalNotificationServiceExtension.entitlements
sed -i "" -E "s/com\.differential\.apollos/$IOS_BUNDLE/g" "ios/$CLEAN_APP.xcodeproj/project.pbxproj"
sed -i "" -E "s/DEVELOPMENT_TEAM = \w+;/DEVELOPMENT_TEAM = \"\";/g" "ios/$CLEAN_APP.xcodeproj/project.pbxproj"

rm "ios/$CLEAN_APP.xcworkspace/xcshareddata/xcschemes/apolloschurchapp.xcscheme"

echo "APP_DATA_URL=$SERVER_URL
GOOGLE_MAPS_API_KEY=$GOOGLE_MAPS_KEY" >.env

rm -rf node_modules
yarn
APP_DATA_URL=$SERVER_URL node scripts/get-introspection-data.js

# graphics
curl -s "$LOGO" --output src/img/logo.png
curl -s "$WORDMARK" --output src/img/wordmark.png
GRAPHICS_DIR=$(mktemp -d)
node ../../scripts/generate-app-graphics.js "$GRAPHICS_DIR" "$ICON" "$ICON_BG_COLOR"
cp "$GRAPHICS_DIR/rn-icon.png" src/img/icon.png
yarn react-native set-splash --path "$GRAPHICS_DIR/splash.png" --background "$ICON_BG_COLOR"
yarn react-native set-icon --path "$GRAPHICS_DIR/ios.png" --platform ios
yarn react-native set-icon --path "$GRAPHICS_DIR/android.png" --platform android
