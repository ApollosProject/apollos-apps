// If we have a sources array, return that.
// Otherwise, return the URL or URI field. Add in the typename provided to the source.
const addTypenameToSources = (__typename) => ({ sources, url, uri }) =>
  sources || [{ __typename, uri: url || uri }];

export default {
  Media: {
    __resolveType: ({ apollosType }) => apollosType,
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
};
