import { graphql } from 'graphql';
import fetch from 'isomorphic-fetch';
import { makeExecutableSchema, gql } from 'apollo-server';

import { createGlobalId } from '../../node/model';
import { getContext } from '../../../';
// we import the root-level schema and resolver so we test the entire integration:
import { schema as typeDefs, resolvers } from '../../';

import { exampleRockContentItemShape } from '../../content-items/__tests__/resolvers.tests';

export const exampleRockContentChannelShape = {
  ContentChannelTypeId: 6,
  Name: 'My super cool content channel',
  Description: 'Some description',
  IconCssClass: 'fa fa-star',
  RequiresApproval: false,
  ItemsManuallyOrdered: false,
  ChildItemsManuallyOrdered: false,
  EnableRss: false,
  ChannelUrl: '',
  ItemUrl: '',
  TimeToLive: 0,
  ContentControlType: 0,
  RootImageDirectory: '',
  IsIndexEnabled: false,
  IsTaggingEnabled: false,
  ItemTagCategoryId: null,
  CreatedDateTime: null,
  ModifiedDateTime: '2018-01-01T01:01:01.001',
  CreatedByPersonAliasId: null,
  ModifiedByPersonAliasId: 61,
  Id: 'some-id',
  Guid: 'some-sort-of-long-guid',
  ForeignId: null,
  ForeignGuid: null,
  ForeignKey: null,
};

const contentChannelFragment = gql`
  fragment ContentChannelFragment on ContentChannel {
    id
    __typename
    name
    description
    childContentChannels {
      id
      __typename
      name
      description
    }
    childContentItemsConnection {
      edges {
        cursor
        node {
          id
          __typename
        }
      }
    }
  }
`;

describe('ContentChannel', () => {
  let schema;
  let context;
  beforeEach(() => {
    fetch.resetMocks();
    schema = makeExecutableSchema({ typeDefs, resolvers });
    context = getContext();
  });

  it('gets a list of content channels', async () => {
    fetch.mockResponses(
      [JSON.stringify([exampleRockContentChannelShape])],
      [JSON.stringify([exampleRockContentItemShape])]
    );
    const query = gql`
      query {
        contentChannels {
          ...ContentChannelFragment
        }
      }
      ${contentChannelFragment}
    `;
    const rootValue = {};
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });

  it('gets a single content channel when querying by root node', async () => {
    fetch.mockResponses(
      [
        JSON.stringify([
          // todo: is there a better way to mock server responses?
          {
            ChildContentChannels: [
              {
                ...exampleRockContentChannelShape,
              },
            ],
            ...exampleRockContentChannelShape,
            Id: 1,
          },
        ]),
      ],
      [JSON.stringify([exampleRockContentItemShape])]
    );

    const query = gql`
      query {
        node(
          id: "${createGlobalId(1, 'ContentChannel')}"
        ) {
          ...on ContentChannel {
            ...ContentChannelFragment
          }
        }
      }
      ${contentChannelFragment}
    `;
    const rootValue = {};
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });
});
