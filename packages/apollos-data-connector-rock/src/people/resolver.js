import moment from 'moment-timezone';
import { createGlobalId } from '@apollosproject/server-core';
import ApollosConfig from '@apollosproject/config';
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
    id: ({ id }, args, context, { parentType }) =>
      createGlobalId(id, parentType.name),
    photo: ({ photo: { url } }) => (url ? { uri: url } : null),
    birthDate: enforceCurrentUser(({ birthDate }) =>
      birthDate
        ? moment.tz(birthDate, ApollosConfig.ROCK.TIMEZONE).toJSON()
        : null
    ),
    gender: enforceCurrentUser(({ gender }, args, { dataSources }) =>
      dataSources.Person.mapGender({ gender })
    ),
    email: enforceCurrentUser(({ email }) => email),
  },
};
