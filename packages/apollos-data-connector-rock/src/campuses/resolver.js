import { createGlobalId } from '@apollosproject/server-core';
import {
  enforceCurrentUser,
  latLonDistance,
  createImageUrlFromGuid,
} from '../utils';

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
    image: ({ location }) =>
      location.image
        ? {
            uri: createImageUrlFromGuid(location.image.guid),
            width: location.image.width,
            height: location.image.height,
          }
        : null,
    distanceFromLocation: (campus, { location } = {}) => {
      if (location) {
        return latLonDistance(
          location.latitude,
          location.longitude,
          campus.location.latitude,
          campus.location.longitude
        );
      }
      return campus.distanceFromLocation;
    },
  },
  Person: {
    campus: enforceCurrentUser(({ id }, args, { dataSources }) =>
      dataSources.Campus.getForPerson({ personId: id })
    ),
  },
  Mutation: {
    updateUserCampus: (root, { campusId }, { dataSources }) =>
      dataSources.Campus.updateCurrentUserCampus({ campusId }),
  },
};
