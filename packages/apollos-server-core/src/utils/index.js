/* eslint-disable import/prefer-default-export */
/*
Used like this
```
import { ContentItem } from '@apollosproject/data-connector-rock'
const resolver = {
  ContentItem: {
    title: () => ...
  }
}

export default resolverMerge(resolver, ContentItem)
```
*/

export const resolverMerge = (newResolver, { resolver = {} }) => {
  const finalResolver = {};
  // For each of the keys present in both new and old resolvers
  Object.keys({ ...newResolver, ...resolver }).forEach((key) => {
    // Merge in the new resolver, then the old resolver.
    // (We don't want to mutate either, and use Object.assign to make that explicit)
    finalResolver[key] = { ...resolver[key], ...newResolver[key] };
  });
  return finalResolver;
};

export const schemaMerge = () => {
  console.error('schemaMerge has been removed. Please use resolverMerge.');
};
