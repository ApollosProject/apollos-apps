import { createGlobalId } from '@apollosproject/server-core';
import { enforceCurrentUser } from '../utils';

export default {
  Group: {
    id: ({ id }, args, context, { parentType }) =>
      createGlobalId(id, parentType.name),
    leaders: ({ id }, args, { dataSources }) =>
      dataSources.Group.getLeaders(id),
    members: ({ id }, args, { dataSources }) =>
      dataSources.Group.getMembers(id),
  },
  Person: {
    groups: enforceCurrentUser(({ id }, { type, asLeader }, { dataSources }) =>
      dataSources.Group.getByPerson({ personId: id, type, asLeader })
    ),
  },
};
