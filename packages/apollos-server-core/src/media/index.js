export { mediaSchema as schema } from '@apollosproject/data-schema';

const addTypenameToSources = (__typename) => ({ sources }) =>
  sources.map((s) => ({ __typename, ...s }));

export const resolver = {
  Media: {
    // Implementors must attach __typename to root.
    __resolveType: ({ __typename }) => __typename,
  },
  MediaSource: {
    // Implementors must attach __typename to root.
    __resolveType: ({ __typename }) => __typename,
  },
  ImageMedia: {
    sources: addTypenameToSources('ImageMediaSource'),
  },
  AudioMedia: {
    sources: addTypenameToSources('AudioMediaSource'),
  },
  VideoMedia: {
    sources: addTypenameToSources('VideoMediaSource'),
  },
  ImageMediaSource: {
    uri: ({ uri = '' }) => {
      if (!uri || typeof uri !== 'string') return null;
      if (uri.startsWith('//')) return `https:${uri}`;
      return uri;
    },
  },
};
