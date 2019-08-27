import { graphql } from 'graphql';
import { createTestHelpers } from '@apollosproject/server-core/lib/testUtils';

import { campusSchema, peopleSchema } from '@apollosproject/data-schema';
import * as Events from '../index';
import { Campus } from '../../index';

const { getSchema, getContext } = createTestHelpers({
  Events,
  Campus,
});

describe('Events resolver', () => {
  let schema;
  let context;
  let rootValue;
  beforeEach(() => {
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

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });
});
