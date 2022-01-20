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
    latitude: ({ location }) => location.latitude,
    longitude: ({ location }) => location.longitude,
    postalCode: (root, args, { dataSources: { Campus } }) =>
      Campus.getAddressField({ field: 'postalCode', root }),
    city: (root, args, { dataSources: { Campus } }) =>
      Campus.getAddressField({ field: 'city', root }),
    state: (root, args, { dataSources: { Campus } }) =>
      Campus.getAddressField({ field: 'state', root }),
    street1: (root, args, { dataSources: { Campus } }) =>
      Campus.getAddressField({ field: 'street1', root }),
    street2: (root, args, { dataSources: { Campus } }) =>
      Campus.getAddressField({ field: 'street2', root }),
    image: ({ location }) =>
      location.image
        ? {
            uri: createImageUrlFromGuid(location.image.guid),
            width: location.image.width,
            height: location.image.height,
          }
        : null,
  },
  Person: {
    campus: (person, args, { dataSources }) =>
      dataSources.Campus.getForPerson(person),
  },
  Mutation: {
    updateUserCampus: (root, { campusId }, { dataSources }) =>
      dataSources.Campus.updateCurrentUserCampus({ campusId }),
  },
};
