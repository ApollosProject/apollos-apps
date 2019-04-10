import { createGlobalId } from '@apollosproject/server-core';
import { enforceCurrentUser } from '../utils';

// Rock returns `{}` instead of `null` for null values.
// This function eliminates the annoyance of checking those values.
export const ifExists = (field) => (typeof field === 'object' ? null : field);

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
    photo: ({ photo: { url } }) => ({ uri: url }),
    firstName: ({ firstName }) => ifExists(firstName),
    lastName: ({ lastName }) => ifExists(lastName),
    birthDate: enforceCurrentUser(({ birthDate }) => ifExists(birthDate)),
    gender: enforceCurrentUser(({ gender }) => gender),
    email: enforceCurrentUser(({ email }) => ifExists(email)),
  },
  GENDER: {
    Unknown: 0,
    Male: 1,
    Female: 2,
  },
};
