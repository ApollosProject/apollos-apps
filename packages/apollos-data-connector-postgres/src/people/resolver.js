import moment from 'moment-timezone';
import { withEdgePagination } from '@apollosproject/server-core';
import { startCase, toLower } from 'lodash';
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
    nickName: ({ firstName }) => `${firstName}`,
    gender: ({ gender }) => startCase(toLower(gender)),
  },
  SearchPeopleResultsConnection: {
    edges: (edges) => edges,
    pageInfo: (edges) => withEdgePagination({ edges }),
  },
  Query: {
    suggestedFollows: async (root, args, { dataSources: { Follow } }) =>
      Follow.getStaticSuggestedFollowsForCurrentPerson(),
    searchPeople: async (root, input, { dataSources }) =>
      dataSources.Person.byPaginatedQuery(input),
  },
};
