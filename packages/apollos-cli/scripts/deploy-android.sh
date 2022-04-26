TRACK=$1

if [ -n "$(git status --porcelain)" ]; then
  echo "Git status not clean!"
  git status --porcelain
  exit 1
fi

COMMITS=$(git rev-list --count HEAD)
sed -i "" -E "s/versionCode [0-9]+\s*$/versionCode $COMMITS/g" android/app/build.gradle
fastlane run gradle task:clean project_dir:android
fastlane run gradle task:bundle build_type:Release project_dir:android
fastlane run changelog_from_git_commits

PACKAGE=$(grep applicationId android/app/build.gradle | sed -E "s/.*applicationId[[:space:]]+\"(.*)\".*/\1/")
if [ "$TRACK" = "internal" ]; then
  fastlane run supply \
    track:$TRACK \
    skip_upload_apk:true \
    json_key:fastlane/google-api-key.json \
    package_name:$PACKAGE
else
  fastlane run supply \
    track:internal \
    track_promote_to:$TRACK \
    version_code:$COMMITS \
    skip_upload_apk:true \
    skip_upload_aab:true \
    json_key:fastlane/google-api-key.json \
    package_name:$PACKAGE
fi
