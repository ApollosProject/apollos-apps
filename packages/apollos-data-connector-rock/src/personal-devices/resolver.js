import { createGlobalId } from '@apollosproject/server-core';

export default {
  Device: {
    id: ({ id }) => createGlobalId(id, 'Device'),
    pushId: ({ deviceRegistrationId }) => deviceRegistrationId,
  },
  Person: {
    devices: ({ primaryAliasId }, args, { dataSources }) =>
      dataSources.PersonalDevice.getByPersonAliasId(primaryAliasId),
  },
};
