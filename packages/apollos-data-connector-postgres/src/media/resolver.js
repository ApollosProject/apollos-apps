export default {
  Media: {
    __resolveType: ({ apollosType }) => apollosType,
  },
  ImageMedia: {
    sources: ({ url, sources }) =>
      sources || [{ __typename: 'ImageMediaSource', uri: url }],
  },
  AudioMedia: {
    sources: ({ url, sources }) =>
      sources || [{ __typename: 'AudioMediaSource', uri: url }],
  },
  VideoMedia: {
    sources: ({ url, sources }) =>
      sources || [{ __typename: 'VideoMediaSource', uri: url }],
  },
};
