import { resolverMerge } from '../index';

describe('Resolver Merge Util', () => {
  it('safely merges schemas from a data connector without a schema', () => {
    const ContentItem = {};
    const resolver = { ContentItem: { name: 'foo' } };
    expect(resolverMerge(resolver, ContentItem)).toEqual({
      ContentItem: { name: 'foo' },
    });
  });
  it('merges schemas from a data connector with a schema', () => {
    const ContentItem = {
      resolver: { ContentItem: { name: 'foo', description: 'foo' } },
    };
    const resolver = { ContentItem: { name: 'bar', subtitle: 'bar' } };
    expect(resolverMerge(resolver, ContentItem)).toEqual({
      ContentItem: { name: 'bar', description: 'foo', subtitle: 'bar' },
    });
  });
  it('merges field that are only on the new resolver', () => {
    const ContentItem = { resolver: { ContentItem: { name: 'foo' } } };
    const resolver = {
      ContentItem: { description: 'bar' },
      Query: { someNewThing: 'bar' },
    };
    expect(resolverMerge(resolver, ContentItem)).toEqual({
      ContentItem: { name: 'foo', description: 'bar' },
      Query: { someNewThing: 'bar' },
    });
  });
  it('merges field that are only on the old data connector', () => {
    const ContentItem = {
      resolver: {
        ContentItem: { name: 'foo' },
        Mutation: { someOldMutation: 'foo' },
      },
    };
    const resolver = {
      ContentItem: { description: 'bar' },
    };
    expect(resolverMerge(resolver, ContentItem)).toEqual({
      ContentItem: { name: 'foo', description: 'bar' },
      Mutation: { someOldMutation: 'foo' },
    });
  });
});
