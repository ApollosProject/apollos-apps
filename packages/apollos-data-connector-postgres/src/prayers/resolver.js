import { createGlobalId } from '@apollosproject/server-core';

export default {
  Mutation: {
    addPrayer: (root, args, { dataSources: { PrayerRequest } }) =>
      PrayerRequest.addPrayer(args),
  },
  PrayerRequest: {
    id: ({ id }, args, context, { parentType }) =>
      createGlobalId(id, parentType.name),
    isAnonymous: ({ isPublic }) => !isPublic,
    requestor: async (root) => {
      return root.getRequestor();
    },
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
  PrayerListFeature: {
    // id: ID!
    // order: Int
    // title: String
    // subtitle: String
    // prayers: [Prayer]
  },
};
