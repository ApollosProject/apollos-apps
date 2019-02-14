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

export default schemaMerge(resolver, ContentItem)
```
*/

export const schemaMerge = (newResolver, { resolver = {} }) => {
  const finalResolver = {};
  // For each of the keys present in both new and old resolvers
  Object.keys({ ...newResolver, ...resolver }).forEach((key) => {
    // Merge in the new resolver, then the old resolver.
    // (We don't want to mutate either, and use Object.assign to make that explicit)
    finalResolver[key] = Object.assign({}, resolver[key], newResolver[key]);
  });
  return finalResolver;
};
