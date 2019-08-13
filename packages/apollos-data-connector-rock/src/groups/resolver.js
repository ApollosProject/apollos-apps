import { createGlobalId } from '@apollosproject/server-core';
import { enforceCurrentUser } from '../utils';

export default {
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
    families: ({ id }, args, { dataSources }) =>
      dataSources.Group.getFamilies(id),
    homeGroups: ({ id }, args, { dataSources }) =>
      dataSources.Group.getHomeGroups(id),
    servingGroups: ({ id }, args, { dataSources }) =>
      dataSources.Group.getServingGroups(id),
  },
};
