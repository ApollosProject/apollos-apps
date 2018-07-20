import { createGlobalId } from '../node';

export default {
  Query: {
    people: (root, { email }, { models }) => models.Person.getFromEmail(email),
  },
  Person: {
    id: ({ id }, args, context, { parentType }) =>
      createGlobalId(id, parentType.name),
    photo: ({ photo: { url } }) => {
      if (url) return { uri: url };
      return { uri: '' };
    },
  },
};
