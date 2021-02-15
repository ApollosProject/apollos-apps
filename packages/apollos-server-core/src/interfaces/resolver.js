const __resolveType = ({ __typename, __type }, args, resolveInfo) =>
  __typename || resolveInfo.schema.getType(__type);

export default {
  LikableNode: {
    __resolveType,
  },
  SharableNode: {
    __resolveType,
  },
  LiveNode: {
    __resolveType,
  },
  Card: {
    __resolveType,
  },
  ContentNode: {
    __resolveType,
  },
  ContentChildNode: {
    __resolveType,
  },
  ContentParentNode: {
    __resolveType,
  },
  VideoNode: {
    __resolveType,
  },
  AudioNode: {
    __resolveType,
  },
  ProgressNode: {
    __resolveType,
  },
  ScriptureNode: {
    __resolveType,
  },
  ThemedNode: {
    __resolveType,
  },
  FeaturesNode: {
    __resolveType,
  },
};
