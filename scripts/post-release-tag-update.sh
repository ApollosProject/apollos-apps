# If you are managing the release, run this script AFTER pulling down `master` AFTER merging the release branch.
# This will tag the release properly so that our canary releases will work.

PACKAGE_VERSION=$(cat packages/apolloschurchapp/apollos.json \
  | grep \"version\" \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

echo "Updating tags for version $PACKAGE_VERSION"

git tag -d v$PACKAGE_VERSION

git tag v$PACKAGE_VERSION -m "Release v$PACKAGE_VERSION"

git push origin --tags