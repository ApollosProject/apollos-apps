import { graphql } from 'graphql';
import { createTestHelpers } from '@apollosproject/server-core';

import {
  campusSchema,
  peopleSchema,
  interfacesSchema,
  contentItemSchema,
  contentChannelSchema,
  themeSchema,
  scriptureSchema,
} from '@apollosproject/data-schema';
import * as Event from '../index';

const { getSchema, getContext } = createTestHelpers({
  Event,
  Campus: {
    resolver: { Query: { campuses: () => [{ events: [{ id: 1 }] }] } },
  },
});

describe('Events resolver', () => {
  let schema;
  let context;
  let rootValue;
  beforeEach(async () => {
    schema = getSchema([
      campusSchema,
      peopleSchema,
      interfacesSchema,
      contentItemSchema,
      contentChannelSchema,
      themeSchema,
      scriptureSchema,
    ]);
    context = await getContext();
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
    context.dataSources.Config = { ROCK: { TIMEZONE: 'America/New_York' } };
    context.dataSources.Event.getByCampus = () => [
      {
        id: 1,
        campusId: 1,
        scheduleId: 1,
        location: '123 Main St',
        schedule: {
          iCalendarContent:
            'BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nDTEND:20130501T190000\r\nDTSTART:20130501T180000\r\nRRULE:FREQ=WEEKLY;BYDAY=SA\r\nEND:VEVENT\r\nEND:VCALENDAR',
        },
      },
    ];

    context.dataSources.Event.getName = () => 'Cookout';
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });
});
