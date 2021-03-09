import { createGlobalId } from '@apollosproject/server-core';

const resolver = {
  Message: {
    id: ({ htmlContent }) => createGlobalId(htmlContent, 'Message'),
    __typename: 'Message',
  },
};

class dataSource {
  getFromId = (id) => JSON.parse(id);
}

export { resolver, dataSource };
