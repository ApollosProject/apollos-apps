import { graphql } from 'graphql';
import { createTestHelpers } from '@apollosproject/server-core/lib/testUtils';
// import { fetch } from 'apollo-server-env';
// import ApollosConfig from '@apollosproject/config';

import { campusSchema, peopleSchema } from '@apollosproject/data-schema';
import * as Events from '../index';
import { Campus } from '../../index';

// ApollosConfig.loadJs({
// ROCK: {
// API_URL: 'https://apollosrock.newspring.cc/api',
// API_TOKEN: 'some-rock-token',
// },
// });

const { getSchema, getContext } = createTestHelpers({
  Events,
  Campus,
});

describe('Events resolver', () => {
  let schema;
  let context;
  let rootValue;
  beforeEach(() => {
    // fetch.resetMocks();
    // fetch.mockRockDataSourceAPI();
    schema = getSchema([campusSchema, peopleSchema]);
    context = getContext();
    rootValue = {};
  });

  it('gets events by campus', async () => {
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
    context.dataSources.Events.getByCampus = jest.fn(() =>
      Promise.resolve([
        { id: 1, campusId: 1, scheduleId: 1, location: '123 Main St' },
      ])
    );
    context.dataSources.Events.getName = jest.fn(() =>
      Promise.resolve('Cookout')
    );
    // for testing the getDateTime datasource function...
    context.dataSources.Events.request = () => ({
      filter: () => ({
        first: () =>
          Promise.resolve({
            iCalendarContent:
              'BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nDTEND:20130501T190000\r\nDTSTART:20130501T180000\r\nRRULE:FREQ=WEEKLY;BYDAY=SA\r\nEND:VEVENT\r\nEND:VCALENDAR',
          }),
      }),
    });

    // first: jest.fn(() =>
    // Promise.resolve({
    // iCalendarContent:
    // 'BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nDTEND:20130501T190000\r\nDTSTART:20130501T180000\r\nRRULE:FREQ=WEEKLY;BYDAY=SA\r\nEND:VEVENT\r\nEND:VCALENDAR',
    // })
    // ),
    // getDateTime: jest.fn(() =>
    // Promise.resolve({
    // start: '2019-08-26T17:00:00',
    // end: '2019-08-26T19:00:00',
    // })
    // ),

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });
});
