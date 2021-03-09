import { createGlobalId } from '@apollosproject/server-core';
import gql from 'graphql-tag';

const schema = gql`
  type Message implements Node {
    id: ID!
    message: String
  }
`;

const resolver = {
  Message: {
    id: ({ message }) => createGlobalId(message, 'Message'),
  },
};

class dataSource {
  getFromId = (id) => JSON.parse(id);
}

export { schema, resolver, dataSource };
