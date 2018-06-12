import { createHttpLink } from 'apollo-link-http';
import { APP_HEIGHLINER_URL } from 'react-native-dotenv';

export default createHttpLink({ uri: APP_HEIGHLINER_URL });
