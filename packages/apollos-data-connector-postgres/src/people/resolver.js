import moment from 'moment-timezone';
// import { createGlobalId } from '@apollosproject/server-core';
// import ApollosConfig from '@apollosproject/config';
import { enforceCurrentUser } from '../utils';

export default {
  Mutation: {
    updateProfileField: (root, { input: { field, value } }, { dataSources }) =>
      dataSources.Person.updateProfile([{ field, value }]),
    updateProfileFields: (root, { input }, { dataSources }) =>
      dataSources.Person.updateProfile(input),
    uploadProfileImage: async (root, { file, size }, { dataSources }) =>
      dataSources.Person.uploadProfileImage(file, size),
  },
  Person: {
    id: ({ apollosId }) => apollosId,
    photo: ({ profileImageUrl }) =>
      profileImageUrl ? { uri: profileImageUrl } : null,
    birthDate: enforceCurrentUser(({ birthDate }) =>
      birthDate ? moment(birthDate).toJSON() : null
    ),
    email: enforceCurrentUser(({ email }) => email),
  },
};
