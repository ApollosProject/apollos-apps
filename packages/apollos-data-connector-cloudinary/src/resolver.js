const resolver = {
  ImageMediaSource: {
    uri: ({ uri = '' }, args, { dataSources }) => {
      if (!uri || typeof uri !== 'string') return null;
      if (uri.startsWith('http'))
        return dataSources.Cloudinary.withCloudinary(uri);
      if (uri.startsWith('//'))
        return dataSources.Cloudinary.withCloudinary(`https:${uri}`);
      return uri;
    },
  },
};

export default resolver;
