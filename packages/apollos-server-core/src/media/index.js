export { mediaSchema as schema } from '@apollosproject/data-schema';

export const resolver = {
  Media: {
    // Implementors must attach __typename to root.
    __resolveType: ({ __typename }) => __typename,
  },
  MediaSource: {
    // Implementors must attach __typename to root.
    __resolveType: ({ __typename }) => __typename,
  },
};
