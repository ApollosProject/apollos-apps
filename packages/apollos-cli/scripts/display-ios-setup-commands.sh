USER=$1
APP_ID=$(grep "PRODUCT_BUNDLE_IDENTIFIER.*One" ios/*.xcodeproj/project.pbxproj |
  sed -n 1p |
  sed -E "s/.*PRODUCT_BUNDLE_IDENTIFIER = \"?(.*).One.*/\1/")

TEMP=$(mktemp)
echo "[
  {
    \"category\": \"CRASH_DATA\",
    \"purposes\": [
      \"APP_FUNCTIONALITY\"
    ],
    \"data_protections\": [
      \"DATA_NOT_LINKED_TO_YOU\"
    ]
  },
  {
    \"category\": \"OTHER_DIAGNOSTIC_DATA\",
    \"purposes\": [
      \"APP_FUNCTIONALITY\"
    ],
    \"data_protections\": [
      \"DATA_NOT_LINKED_TO_YOU\"
    ]
  },
  {
    \"category\": \"PRODUCT_INTERACTION\",
    \"purposes\": [
      \"ANALYTICS\"
    ],
    \"data_protections\": [
      \"DATA_NOT_LINKED_TO_YOU\"
    ]
  }
]" >"$TEMP"

echo "---
fastlane produce -a $APP_ID -u $USER
fastlane produce enable_services --app-group --push-notification --associated-domains -a $APP_ID -u $USER
fastlane produce -a $APP_ID.OneSignalNotificationServiceExtension --skip_itc -u $USER
fastlane produce enable_services --app-group -a $APP_ID.OneSignalNotificationServiceExtension -u $USER
fastlane produce group -g group.$APP_ID.onesignal -n \"OneSignal Group\" -u $USER
fastlane produce associate_group -a $APP_ID group.$APP_ID.onesignal -u $USER
fastlane produce associate_group -a $APP_ID.OneSignalNotificationServiceExtension group.$APP_ID.onesignal -u $USER
fastlane run upload_app_privacy_details_to_app_store app_identifier:$APP_ID username:$USER json_path:$TEMP
---"
