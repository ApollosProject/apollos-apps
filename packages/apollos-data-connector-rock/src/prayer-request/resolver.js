import { createGlobalId } from '@apollosproject/server-core';

export default {
  Mutation: {
    addPrayer: (root, args, { dataSources }) =>
      dataSources.PrayerRequest.addPrayer(args),
  },
  PrayerRequest: {
    id: ({ id }, args, context, { parentType }) =>
      createGlobalId(id, parentType.name),
    isAnonymous: ({ isPublic }) => !isPublic,
    requestor: ({ requestedByPersonAliasId }, args, { dataSources }) =>
      dataSources.Person.getFromAliasId(requestedByPersonAliasId),
    isPrayed: async ({ id }, args, { dataSources }, { parentType }) => {
      const interactions = await dataSources.Interactions.getInteractionsForCurrentUserAndNodes(
        {
          nodeIds: [createGlobalId(id, parentType.name)],
          actions: ['PRAY'],
        }
      );
      return interactions.length;
    },
  },
  Person: {
    prayers: async ({ primaryAliasId }, args, { dataSources }) => {
      return (
        await dataSources.PrayerRequest.byDailyPrayerFeed({
          primaryAliasId,
        })
      ).get();
    },
  },
  PrayerListFeature: {
    // id: ID!
    // order: Int
    // title: String
    // subtitle: String
    // prayers: [Prayer]
  },
};
