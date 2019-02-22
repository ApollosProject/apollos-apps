import { createGlobalId } from '@apollosproject/server-core';
import { createImageUrlFromGuid } from '../utils';

export default {
  Query: {
    campuses: (root, { location }, { dataSources }) =>
      dataSources.Campus.getByLocation(location),
  },
  Campus: {
    id: ({ id }, args, context, { parentType }) =>
      createGlobalId(id, parentType.name),
    city: ({ location }) => location.city,
    latitude: ({ location }) => location.latitude,
    longitude: ({ location }) => location.longitude,
    postalCode: ({ location }) => location.postalCode,
    state: ({ location }) => location.state,
    street1: ({ location }) => location.street1,
    street2: ({ location }) => location.street2,
    image: ({ location }) => ({
      uri: createImageUrlFromGuid(location.image.guid),
      width: location.image.width,
      height: location.image.height,
    }),
  },
};
