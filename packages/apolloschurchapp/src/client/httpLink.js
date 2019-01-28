import { Platform } from 'react-native';
import { createUploadLink } from 'apollo-upload-client';
import Config from 'react-native-config';

let uri = Config.APP_DATA_URL;
const androidUri = Config.ANDROID_URL || '10.0.2.2';

// Android's emulator requires localhost network traffic to go through 10.0.2.2
if (Platform.OS === 'android') uri = uri.replace('localhost', androidUri);

export default createUploadLink({ uri });
