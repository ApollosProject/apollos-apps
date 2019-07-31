import { createGlobalId } from '@apollosproject/server-core';
import { enforceCurrentUser } from '../utils';

export default {
  Query: {
    groups: (root, args, { dataSources }) => dataSources.Group.getAll(),
    families: (root, { personId }, { dataSources }) =>
      dataSources.Group.getFamilies(personId),
    homeGroups: (root, { personId }, { dataSources }) =>
      dataSources.Group.getHomeGroups(personId),
    servingGroups: (root, { personId }, { dataSources }) =>
      dataSources.Group.getServingGroups(personId),
  },
  Group: {
    id: ({ id }, args, context, { parentType }) =>
      createGlobalId(id, parentType.name),
    leader: ({ id }, args, { dataSources }) => dataSources.Group.getLeader(id),
    members: ({ id }, args, { dataSources }) =>
      dataSources.Group.getMembers(id),
  },
  Person: {
    groups: enforceCurrentUser(({ id }, args, { dataSources }) =>
      dataSources.Group.getByPerson(id)
    ),
    groupsLead: enforceCurrentUser(({ id }, args, { dataSources }) =>
      dataSources.Group.getLeadByPerson(id)
    ),
  },
};
