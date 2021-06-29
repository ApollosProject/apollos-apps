const addTypenameToSources = (__typename) => ({ url }) => [
  { __typename, uri: url },
];

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
