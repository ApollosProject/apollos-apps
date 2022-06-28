TRACK=$2

if [ -z "$CHURCH" ] || [ -z "$APOLLOS_API_KEY" ]; then
  echo "CHURCH and APOLLOS_API_KEY required!"
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "Git status not clean!"
  git status --porcelain
  exit 1
fi

cd "deploys/mobile/$CHURCH" || exit 1

API_URL="https://apollos-cluster-production.herokuapp.com/api"
MATCH_GIT_BASIC_AUTHORIZATION=$(curl -s --fail -H "accept: text/plain" -H "x-api-key: $APOLLOS_API_KEY" "$API_URL/config/$CHURCH/APP.MATCH_TOKEN")
MATCH_PASSWORD=$(curl -s --fail -H "accept: text/plain" -H "x-api-key: $APOLLOS_API_KEY" "$API_URL/config/$CHURCH/APP.MATCH_PASSWORD")
MATCH_GIT_URL=$(curl -s --fail -H "accept: text/plain" -H "x-api-key: $APOLLOS_API_KEY" "$API_URL/config/$CHURCH/APP.MATCH_REPO")
FASTLANE_ITC_TEAM_NAME=$(curl -s --fail -H "accept: text/plain" -H "x-api-key: $APOLLOS_API_KEY" "$API_URL/config/$CHURCH/APP.APPLE_TEAM_NAME")
FASTLANE_TEAM_ID=$(curl -s --fail -H "accept: text/plain" -H "x-api-key: $APOLLOS_API_KEY" "$API_URL/config/$CHURCH/APP.APPLE_TEAM_ID")
APPLE_API_KEY=$(curl -s --fail -H "accept: text/plain" -H "x-api-key: $APOLLOS_API_KEY" "$API_URL/config/$CHURCH/APP.APPLE_API_KEY")

printf "%s" "$APPLE_API_KEY" >fastlane/apple-api-key.json

APP_ID=$(grep "PRODUCT_BUNDLE_IDENTIFIER.*One" ios/*.xcodeproj/project.pbxproj |
  sed -n 1p |
  sed -E "s/.*PRODUCT_BUNDLE_IDENTIFIER = \"?(.*).One.*/\1/")

TARGET=$(grep "target" ios/Podfile | sed -n 1p | sed -E "s/target '(.*)'.*/\1/")
BUILD_NUMBER=$(git rev-list --count HEAD)
VERSION=$(NO_COLOR=1 fastlane run get_version_number xcodeproj:ios target:"$TARGET" |
  grep Result |
  sed -E "s/.*Result: ([\d\.]*)/\1/")

# use default keychain for local deployments
LOCAL=$(fastlane run setup_ci | grep "skipping CI")
if [ -z "$LOCAL" ]; then
  export MATCH_KEYCHAIN_NAME="fastlane_tmp_keychain"
  export MATCH_KEYCHAIN_PASSWORD=""
fi

export MATCH_GIT_BASIC_AUTHORIZATION
export MATCH_PASSWORD
export MATCH_GIT_URL
export FASTLANE_ITC_TEAM_NAME
export FASTLANE_TEAM_ID

if [ "$TRACK" = "internal" ] || [ -z "$TRACK" ]; then
  fastlane match appstore -a "$APP_ID,$APP_ID.OneSignalNotificationServiceExtension" --git-branch "$CHURCH" --readonly
  fastlane run increment_build_number build_number:"$BUILD_NUMBER" xcodeproj:"ios/$TARGET.xcodeproj"
  fastlane run build_app scheme:"$TARGET" workspace:"ios/$TARGET.xcworkspace"
  fastlane run testflight api_key_path:fastlane/apple-api-key.json
elif [ "$TRACK" = "beta" ]; then
  fastlane run testflight api_key_path:fastlane/apple-api-key.json \
    app_identifier:"$APP_ID" \
    distribute_only:true \
    distribute_external:true \
    groups:"Beta Testers" \
    app_platform:ios \
    build_number:"$BUILD_NUMBER"
elif [ "$TRACK" = "production" ]; then
  fastlane deliver --api_key_path fastlane/apple-api-key.json \
    --skip_binary_upload true \
    --overwrite_screenshots false \
    --submit_for_review true \
    --automatic_release true \
    --submission_information "{\"add_id_info_uses_idfa\": false }" \
    --reject_if_possible true \
    --run_precheck_before_submit false \
    --app_version "$VERSION" \
    --build_number "$BUILD_NUMBER" \
    --force true
fi
