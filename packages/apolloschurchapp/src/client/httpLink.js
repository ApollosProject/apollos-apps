import { Platform } from 'react-native';
import { createUploadLink } from 'apollo-upload-client';
import { APP_DATA_URL } from 'react-native-dotenv';

let uri = APP_DATA_URL;

// Android's emulator requires localhost network traffic to go through 10.0.2.2
// If testing on an Android hardware device, you will need to replace 10.0.2.2 with your IP address.
if (Platform.OS === 'android') uri = uri.replace('localhost', '10.0.2.2');
// Running the app on a hardware iOS device requires localhost network traffic to go to your specific IP address.
// if (Platform.OS === 'ios') uri = uri.replace('localhost', '10.0.201.75');

export default createUploadLink({ uri });
