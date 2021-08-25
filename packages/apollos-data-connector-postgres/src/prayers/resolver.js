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
    isPrayed: async (
      { prayedUsers },
      args,
      { currentPostgresPerson: { id: currentPersonId } }
    ) => {
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
