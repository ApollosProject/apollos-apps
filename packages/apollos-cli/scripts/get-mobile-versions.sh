USER=$1
IOS_ID=$(grep "PRODUCT_BUNDLE_IDENTIFIER.*One" ios/*.xcodeproj/project.pbxproj |
  sed -n 1p |
  sed -E "s/.*PRODUCT_BUNDLE_IDENTIFIER = \"?(.*).One.*/\1/")

ANDROID_ID=$(grep "applicationId" android/app/build.gradle |
  sed -E "s/.*applicationId \"(.*)\"/\1/")

IOS_TESTFLIGHT=$(fastlane run latest_testflight_build_number "username:$USER" "app_identifier:$IOS_ID" |
  grep Result |
  sed -E "s/.*Result: (.*)/\1/")

echo "iOS TestFlight: $IOS_TESTFLIGHT"

IOS_PROD=$(fastlane run app_store_build_number "username:$USER" "app_identifier:$IOS_ID" |
  grep Result |
  sed -E "s/.*Result: (.*)/\1/")

echo "iOS Production: $IOS_PROD"

ANDROID_INTERNAL=$(fastlane run google_play_track_version_codes track:internal "json_key:fastlane/google-api-key.json" "package_name:$ANDROID_ID" |
  grep Result |
  sed -E "s/.*Result: \[(.*)\]/\1/")

echo "Android Internal: $ANDROID_INTERNAL"

ANDROID_PROD=$(fastlane run google_play_track_version_codes "json_key:fastlane/google-api-key.json" "package_name:$ANDROID_ID" |
  grep Result |
  sed -E "s/.*Result: \[(.*)\]/\1/")

echo "Android Production: $ANDROID_PROD"
