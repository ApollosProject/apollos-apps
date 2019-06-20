export { featuresSchema as schema } from '@apollosproject/data-schema';

export const resolver = {
  Feature: {
    // Implementors must attach __typename to root.
    __resolveType: ({ __typename }) => __typename,
  },
};
