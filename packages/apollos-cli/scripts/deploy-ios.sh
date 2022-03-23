TRACK=$1

APP_ID=$(grep "PRODUCT_BUNDLE_IDENTIFIER.*One" ios/*.xcodeproj/project.pbxproj |
  sed -n 1p |
  sed -E "s/.*PRODUCT_BUNDLE_IDENTIFIER = \"?(.*).One.*/\1/")

TARGET=$(grep "target" ios/Podfile | sed -n 1p | sed -E "s/target '(.*)'.*/\1/")
COMMITS=$(git rev-list --count HEAD)
VERSION=$(fastlane run get_version_number xcodeproj:ios target:$TARGET |
  grep Result |
  sed -E "s/.*Result: (.*)/\1/")

if [ "$TRACK" = "internal" ]; then
  fastlane run setup_ci
  KEYCHAIN=$(security list-keychains -d user | sed -E "s/.*Keychains\/(.*)-.*/\1/")
  fastlane match appstore -a "$APP_ID,$APP_ID.OneSignalNotificationServiceExtension" keychain_name:"$KEYCHAIN" --readonly
  fastlane run increment_build_number build_number:"$COMMITS" xcodeproj:"ios/$TARGET.xcodeproj"
  fastlane run build_app scheme:$TARGET workspace:"ios/$TARGET.xcworkspace"
  fastlane run changelog_from_git_commits
  fastlane run testflight api_key_path:fastlane/apple-api-key.json
elif [ "$TRACK" = "beta" ]; then
  fastlane run testflight api_key_path:fastlane/apple-api-key.json \
    distribute_only:true \
    distribute_external:true \
    groups:"Beta Testers"
elif [ "$TRACK" = "production" ]; then
  fastlane deliver --api_key_path fastlane/apple-api-key.json \
    --skip_binary_upload true \
    --overwrite_screenshots true \
    --submit_for_review true \
    --automatic_release true \
    --submission_information "{\"add_id_info_uses_idfa\": false }" \
    --reject_if_possible true \
    --run_precheck_before_submit false \
    --app_version "$VERSION" \
    --build_number "$COMMITS" \
    --force true
fi
