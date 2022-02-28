REPO=$1
GH_USER=$2
GH_TOKEN=$3
KEY_ID=$4
ISSUER_ID=$5
KEY=$6
TEAM_ID=$7
TEAM_NAME=$8

APP_ID=$(grep "PRODUCT_BUNDLE_IDENTIFIER.*One" ios/*.xcodeproj/project.pbxproj |
  sed -n 1p |
  sed -E "s/.*PRODUCT_BUNDLE_IDENTIFIER = \"?(.*).One.*/\1/")

sed -i "" "s/DevelopmentTeam = \w+;/DevelopmentTeam = $TEAM_ID;/g" ios/*.xcodeproj/project.pbxproj
sed -i "" "s/DEVELOPMENT_TEAM = \w+;/DEVELOPMENT_TEAM = $TEAM_ID;/g" ios/*.xcodeproj/project.pbxproj

PASS=$(openssl rand 16 | base64 | sed "s/=//g")

# generate Match repo authorization
AUTH=$(printf "%s" "$GH_USER:$GH_TOKEN" | base64)

CONTENT=$(fastlane run app_store_connect_api_key \
  key_id:$KEY_ID \
  issuer_id:$ISSUER_ID \
  key_filepath:$KEY |
  grep Result |
  sed -E "s/.*key=>\"(.*)\".*/\1/")

printf "%s" "{
\"key_id\": \"$KEY_ID\",
\"issuer_id\": \"$ISSUER_ID\",
\"key\": \"$CONTENT\",
\"in_house\": false
}" >fastlane/apple-api-key.json

echo "
MATCH_PASSWORD=$PASS
MATCH_GIT_URL=$REPO
MATCH_GIT_BASIC_AUTHORIZATION=$AUTH
FASTLANE_TEAM_ID=$TEAM_ID
FASTLANE_TEAM_NAME=\"$TEAM_NAME\"
APP_STORE_CONNECT_API_KEY_PATH=fastlane/apple-api-key.json" >>.env

# TODO fix, timing isn't right downloading metadata here
#fastlane deliver download_metadata -a $APP_ID api_key_path:fastlane/apple-api-key.json
#fastlane deliver download_screenshots -a $APP_ID api_key_path:fastlane/apple-api-key.json

fastlane match development -a "$APP_ID,$APP_ID.OneSignalNotificationServiceExtension" api_key_path:fastlane/apple-api-key.json
fastlane match appstore -a "$APP_ID,$APP_ID.OneSignalNotificationServiceExtension" api_key_path:fastlane/apple-api-key.json
