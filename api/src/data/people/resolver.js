import { createGlobalId } from '../node';

export default {
  Query: {
    people: (root, { email }, { models }) => models.Person.getFromEmail(email),
  },
  Person: {
    id: ({ id }, args, context, { parentType }) =>
      createGlobalId(id, parentType.name),
    firstName: ({ firstName }) => firstName,
    lastName: ({ lastName }) => lastName,
    nickName: ({ nickName }) => nickName,
    birthDay: ({ birthDay }) => birthDay,
    birthMonth: ({ birthMonth }) => birthMonth,
    birthYear: ({ birthYear }) => birthYear,
    email: ({ email }) => email,
  },
};
