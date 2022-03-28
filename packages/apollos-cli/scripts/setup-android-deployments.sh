KEY=$1

# TODO fix, timing isn't right downloading metadata here
#echo "Creating metadata folders..."
cp "$KEY" fastlane/google-api-key.json

if [ ! -f android/app/apollos.keystore ]; then
  echo "Generating keystore..."
  STORE_PW=$(openssl rand 16 | base64 | sed "s/[\/+=]//g")
  KEY_PW=$(openssl rand 16 | base64 | sed "s/[\/+=]//g")
  keytool -genkey -v \
    -keystore android/app/apollos.keystore \
    -storepass "$STORE_PW" \
    -keypass "$KEY_PW" \
    -alias apollos \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000

  echo "
  KEYSTORE_FILE=apollos.keystore
  KEYSTORE_PASSWORD=$STORE_PW
  KEY_ALIAS=apollos
  KEY_PASSWORD=$KEY_PW" >>.env
  echo "Keystore generated at android/app/apollos.keystore! You may want to store externally as this is the only one you can ever use with this app."
fi

echo "Building Android bundle..."
fastlane run gradle task:bundle build_type:Release project_dir:android >/dev/null 2>&1
mkdir -p fastlane/metadata/android

echo "Upload android/app/build/outputs/bundle/release/app-release.aab to the internal testing track, promote to closed testing to create a release, and you're all set!"
