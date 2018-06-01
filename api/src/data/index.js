import { gql } from 'apollo-server';
import { mapValues, values, merge } from 'lodash';

import * as Node from './node';
import * as ContentChannel from './content-channels';
import * as ContentItem from './content-items';

const data = {
  Node,
  ContentChannel,
  ContentItem,
};

export const schema = gql`
  ${values(data).map((datum) => datum.schema)}
  type Query {
    node(id: ID!): Node
    contentChannels: [ContentChannel]
  }
`;

export const resolvers = merge(...values(data).map((datum) => datum.resolver));

export const models = mapValues(data, (datum) => datum.model);
