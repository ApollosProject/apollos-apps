import { latLonDistance } from '../utils';

export default {
  Query: {
    campuses: (root, { location }, { dataSources }) =>
      dataSources.Campus.getByLocation(location),
  },
  Campus: {
    id: ({ apollosId }) => apollosId,
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
    image: (root) => root.getImage(),
    distanceFromLocation: (campus, { location } = {}) => {
      if (location) {
        return latLonDistance(
          location.latitude,
          location.longitude,
          campus.latitude,
          campus.longitude
        );
      }
      return campus.distanceFromLocation;
    },
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
