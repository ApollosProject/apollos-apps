import { graphql } from 'graphql';
import { createTestHelpers } from '@apollosproject/server-core/lib/testUtils';

import { campusSchema, peopleSchema } from '@apollosproject/data-schema';
import * as Events from '../index';
import { Campus } from '../../index';

const { getSchema, getContext } = createTestHelpers({
  Events,
  Campus,
});

describe('PrayerRequest resolver', () => {
  let schema;
  let context;
  let rootValue;
  beforeEach(() => {
    schema = getSchema([campusSchema, peopleSchema]);
    context = getContext();
    rootValue = {};
  });

  it('gets all public prayer requests', async () => {
    const query = `
      query {
        campuses {
          events {
            id
            name
            location
            start
            end
          }
        }
      }
    `;

    context.dataSources.Campus.getByLocation = jest.fn(() =>
      Promise.resolve([{ id: 1 }])
    );
    context.dataSources.Events = {
      getByCampus: jest.fn(() =>
        Promise.resolve([
          { id: 1, campusId: 1, location: '123 Main St' },
          { id: 2, campusId: 1, location: '456 Hwy 789' },
        ])
      ),
      getName: jest.fn(() => Promise.resolve('Cookout')),
      getDateTime: jest.fn(() =>
        Promise.resolve({
          start: '2019-08-26T17:00:00',
          end: '2019-08-26T19:00:00',
        })
      ),
    };
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });
});
