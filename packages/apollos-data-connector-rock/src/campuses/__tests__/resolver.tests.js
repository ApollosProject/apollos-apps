import { graphql } from 'graphql';
import { fetch } from 'apollo-server-env';
import ApollosConfig from '@apollosproject/config';
import { createGlobalId } from '@apollosproject/server-core';
import { createTestHelpers } from '@apollosproject/server-core/lib/testUtils';
import { campusSchema } from '@apollosproject/data-schema';

// we import the root-level schema and resolver so we test the entire integration:
import * as Campus from '../index';

const { getContext, getSchema } = createTestHelpers({ Campus });

ApollosConfig.loadJs({
  ROCK: {
    API_URL: 'https://apollosrock.newspring.cc/api',
    API_TOKEN: 'some-rock-token',
    IMAGE_URL: 'https://apollosrock.newspring.cc/GetImage.ashx',
  },
});

describe('Campus', () => {
  let schema;
  let context;
  beforeEach(() => {
    fetch.resetMocks();
    fetch.mockRockDataSourceAPI();
    schema = getSchema([campusSchema]);
    context = getContext();
  });

  it('gets a campus by id', async () => {
    const query = `
      query {
        node(id: "${createGlobalId(1, 'Campus')}") {
          ...on Campus {
            id
            name
            street1
            street2
            city
            state
            postalCode
            latitude
            longitude
            image {
              uri
            }
            distanceFromLocation
          }
        }
      }
    `;
    const rootValue = {};

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });

  it('gets a campus by id with location', async () => {
    const query = `
      query {
        node(id: "${createGlobalId(1, 'Campus')}") {
          ...on Campus {
            id
            name
            street1
            street2
            city
            state
            postalCode
            latitude
            longitude
            image {
              uri
            }
            distanceFromLocation(location: { latitude: 34, longitude: -82 })
          }
        }
      }
    `;
    const rootValue = {};

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });

  it('gets campuses sorted by location', async () => {
    const query = `
      query {
        campuses(location: { latitude: 34.59814, longitude: -82.62045 }) {
            id
            name
            street1
            street2
            city
            state
            postalCode
            latitude
            longitude
            image {
              uri
            }
            distanceFromLocation
        }
      }
    `;
    const rootValue = {};

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });

  it('gets campuses (without location)', async () => {
    const query = `
      query {
        campuses {
            id
            name
            street1
            street2
            city
            state
            postalCode
            latitude
            longitude
            image {
              uri
            }
            distanceFromLocation
        }
      }
    `;
    const rootValue = {};

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });
});
