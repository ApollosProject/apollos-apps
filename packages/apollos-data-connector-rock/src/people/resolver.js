import { createGlobalId } from '@apollosproject/server-core';
import { enforceCurrentUser } from '../utils';

// Rock returns `{}` instead of `null` for null values.
// This function eliminates the annoyance of checking those values.
export const ifNotObject = (field) =>
  typeof field === 'object' ? null : field;

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
    firstName: ({ firstName }) => ifNotObject(firstName),
    lastName: ({ lastName }) => ifNotObject(lastName),
    birthDate: enforceCurrentUser(({ birthDate }) => ifNotObject(birthDate)),
    gender: enforceCurrentUser(({ gender }) => gender),
    email: enforceCurrentUser(({ email }) => ifNotObject(email)),
  },
  GENDER: {
    Unknown: 0,
    Male: 1,
    Female: 2,
  },
};
