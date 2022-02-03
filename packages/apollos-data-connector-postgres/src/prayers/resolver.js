import { createGlobalId } from '@apollosproject/server-core';

export default {
  Mutation: {
    addPrayer: (root, args, { dataSources: { PrayerRequest } }) =>
      PrayerRequest.addPrayer(args),
    reportPrayer: (root, args, { dataSources: { PrayerRequest } }) =>
      PrayerRequest.reportPrayer(args),
  },
  PrayerRequest: {
    id: ({ id }, args, context, { parentType }) =>
      createGlobalId(id, parentType.name),
    isAnonymous: ({ isPublic }) => !isPublic,
    requestor: async (root) => root.getRequestor(),
    isPrayed: async (
      root,
      args,
      { currentPostgresPerson: { id: currentPersonId } }
    ) => {
      const prayedUsers = root.prayedUsers ?? (await root.getPrayedUsers());
      return (
        prayedUsers.filter(({ id }) => currentPersonId === id).length !== 0
      );
    },
  },
  Person: {
    prayers: async ({ id }, args, { dataSources }) =>
      (
        await dataSources.PrayerRequest.byDailyPrayerFeed({
          personId: id,
        })
      ).get(),
  },
};
