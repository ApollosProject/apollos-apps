import { Platform } from 'react-native';
import { createUploadLink } from 'apollo-upload-client';
import ApollosConfig from '@apollosproject/config';
import { split, createHttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';

let uri = ApollosConfig.APP_DATA_URL || 'http://localhost:4000/graphql';

export default split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'mutation';
  },
  createUploadLink({ uri }),
  createHttpLink({
    uri,
    useGETForQueries: true,
  })
);
