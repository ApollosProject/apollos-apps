import { createGlobalId } from '@apollosproject/server-core';
import { enforceCurrentUser } from '../utils';

export default {
  Query: {
    families: (root, { personId }, { dataSources }) =>
      dataSources.Group.getFamilies(personId),
    homeGroups: (root, { personId }, { dataSources }) =>
      dataSources.Group.getHomeGroups(personId),
    servingGroups: (root, { personId }, { dataSources }) =>
      dataSources.Group.servingGroups(personId),
  },
  Group: {
    id: ({ id }, args, context, { parentType }) =>
      createGlobalId(id, parentType.name),
    leader: ({ id }, args, { dataSources }) =>
      // TODO
      null,
    members: ({ id }) =>
      // TODO
      null,
  },
  Person: {
    groups: enforceCurrentUser(
      ({ id }, args, { dataSources }) =>
        console.log('id', id) || dataSources.Group.getForPerson(id)
    ),
  },
};
