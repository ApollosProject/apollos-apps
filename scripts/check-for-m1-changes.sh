cat ./templates/mobile/ios/apolloschurchapp.xcodeproj/project.pbxproj | grep '"EXCLUDED_ARCHS\[sdk=iphonesimulator\*\]" = i386;'
FOUND=$?
echo $FOUND
if [ $FOUND -eq 0 ];
then
    echo "Dont commit M1 specific xcode changes";
    echo "replace \"EXCLUDED_ARCHS[sdk=iphonesimulator*]\" = i386;"
    echo "with \"EXCLUDED_ARCHS[sdk=iphonesimulator*]\" = \"arm64 i386\";"
    exit 1;
fi