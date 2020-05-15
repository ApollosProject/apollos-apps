import { createGlobalId } from '@apollosproject/server-core';

export default {
  Mutation: {
    addPrayer: (root, args, { dataSources }) =>
      dataSources.Prayer.addPrayer(args),
  },
  Prayer: {
    id: ({ id }, args, context, { parentType }) =>
      createGlobalId(id, parentType.name),
    isAnonymous: ({ isPublic }) => !isPublic,
    requestor: ({ requestedByPersonAliasId }, args, { dataSources }) =>
      dataSources.Person.getFromAliasId(requestedByPersonAliasId),
    isPrayedBy: () => false, // todo
  },
  PrayerListFeature: {
    // id: ID!
    // order: Int
    // title: String
    // subtitle: String
    // prayers: [Prayer]
  },
};
