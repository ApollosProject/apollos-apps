export default {
  Media: {
    __resolveType: ({ apollosType }) => apollosType,
  },
  ImageMedia: {
    sources: ({ url }) => [{ __typename: 'ImageMediaSource', uri: url }],
  },
  AudioMedia: {
    sources: ({ url }) => [{ __typename: 'AudioMediaSource', uri: url }],
  },
  VideoMedia: {
    sources: ({ url }) => [{ __typename: 'VideoMediaSource', uri: url }],
  },
};
