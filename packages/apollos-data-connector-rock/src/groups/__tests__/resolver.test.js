import { graphql } from 'graphql';
import { createTestHelpers } from '@apollosproject/server-core/lib/testUtils';

import { peopleSchema, authSchema } from '@apollosproject/data-schema';
import * as Group from '../index';
import { Auth, Person } from '../../index';

const { getSchema, getContext } = createTestHelpers({
  Group,
  Auth,
  Person,
});

describe('Groups resolver', () => {
  let schema;
  let context;
  let rootValue;
  beforeEach(() => {
    schema = getSchema([authSchema, peopleSchema]);
    context = getContext();
    rootValue = {};
  });

  it('gets user groups', async () => {
    const query = `
      query {
        currentUser {
          profile {
            groups {
              id
              name
              leaders {
                id
                firstName
              }
              members {
                id
                firstName
              }
            }
          }
        }
      }
    `;

    context.dataSources.Auth.getCurrentPerson = jest.fn(() =>
      Promise.resolve({ id: 3 })
    );
    context.dataSources.Person.getFromId = jest.fn(() =>
      Promise.resolve({ id: 3 })
    );
    context.dataSources.Group.getByPerson = jest.fn(() =>
      Promise.resolve([{ id: 1, name: 'franks beer group' }])
    );
    context.dataSources.Group.getLeaders = jest.fn(() =>
      Promise.resolve([
        { id: 1, firstName: 'Frank' },
        { id: 2, firstName: 'Michael' },
      ])
    );
    context.dataSources.Group.getMembers = jest.fn(() =>
      Promise.resolve([
        { id: 2, firstName: 'Caleb' },
        { id: 3, firstName: 'Burke' },
      ])
    );

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });
});
