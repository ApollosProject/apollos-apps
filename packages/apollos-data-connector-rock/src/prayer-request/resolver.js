import { createGlobalId, parseGlobalId } from '@apollosproject/server-core';

export default {
  Mutation: {
    addPrayer: (root, args, { dataSources }) =>
      dataSources.PrayerRequest.addPrayer(args),
    reportPrayer: (root, { prayerId }, { dataSources }) => {
      const { id } = parseGlobalId(prayerId);
      return dataSources.PrayerRequest.flag(id);
    },
  },
  PrayerRequest: {
    id: ({ id }, args, context, { parentType }) =>
      createGlobalId(id, parentType.name),
    isAnonymous: ({ isPublic }) => !isPublic,
    requestor: (root, args, { dataSources }) =>
      dataSources.PrayerRequest.getRequestor(root),
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
    prayers: async ({ id }, args, { dataSources }) => {
      return (
        await dataSources.PrayerRequest.byDailyPrayerFeed({
          personId: id,
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
