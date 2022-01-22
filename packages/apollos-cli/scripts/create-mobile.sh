APP=$1
IOS_BUNDLE=$2
ANDROID_BUNDLE=$3
PROJ=$(echo "$APP" | tr "[:upper:]" "[:lower:]" | sed "s/ /-/g")
echo "Creating mobile app template in ./$PROJ folder..."
TMP_DIR=$(mktemp -d)
curl -L https://github.com/apollosproject/apollos-apps/tarball/master | tar -xz --directory="$TMP_DIR"
mv "$TMP_DIR"/ApollosProject*/templates/mobile $TMP_DIR/$PROJ
rm -rf "$TMP_DIR"/ApollosProject*
DIR=$PWD
cd $TMP_DIR/$PROJ

# Add latest NPM versions
DEPSLINE=$(grep -n "dependencies" package.json | sed -E "s/^([0-9]+):.*/\1/g")
DEVDEPSLINE=$(grep -n "devDependencies" package.json | sed -E "s/^([0-9]+):.*/\1/g")
JSON=$(sed -E "s/^.*\"(@apollosproject\/[a-z\-]+)\".*/\1 /g" package.json)
PKGS=$(echo "$JSON" | sed -n "$DEPSLINE","$DEVDEPSLINE"p | grep "@apollosproject" | tr -d "\n")
DEVPKGS=$(echo "$JSON" | sed -n "$DEVDEPSLINE",/^$/p | grep "@apollosproject" | tr -d "\n")

echo "Updating to latest NPM versions..."
yarn remove $PKGS $DEVPKGS --ignore-scripts >/dev/null 2>&1
yarn add $PKGS --ignore-scripts >/dev/null 2>&1
yarn add --dev $DEVPKGS --ignore-scripts >/dev/null 2>&1
echo "Installing Cocoapods..."
yarn postinstall >/dev/null 2>&1

# remove template encrypted files
rm .env.shared.enc
rm android/key.json.enc
rm android/app/apollos.keystore.enc
rm ios/apollos.p8.enc

CLEAN_APP=$(echo "$APP" | tr -d '[:space:]')
npx react-native-rename "$CLEAN_APP" -b "$ANDROID_BUNDLE"

sed -i "" -E "s/Apollos Church/$APP/g" app.json
sed -i "" -E "s/Apollos Church/$APP/g" ios/$CLEAN_APP/Info.plist
sed -i "" -E "s/Apollos Church/$APP/g" android/app/src/main/res/values/strings.xml
sed -i "" -E "s/Apollos Church/$APP/g" fastlane/metadata/android/en-US/title.txt
sed -i "" -E "s/com\.differential\.apollos/$IOS_BUNDLE/g" ios/$CLEAN_APP/$CLEAN_APP.entitlements
sed -i "" -E "s/com\.differential\.apollos/$IOS_BUNDLE/g" ios/OneSignalNotificationServiceExtension/OneSignalNotificationServiceExtension.entitlements
sed -i "" -E "s/com\.differential\.apollos/$IOS_BUNDLE/g" ios/$CLEAN_APP.xcodeproj/project.pbxproj
sed -i "" -E "s/com\.differential\.apollos/$ANDROID_BUNDLE/g" android/app/_BUCK.txt

mv $TMP_DIR/$PROJ $DIR/$PROJ
rm -rf $TMP_DIR
