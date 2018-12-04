/* eslint-disable import/prefer-default-export */
import withCloudinary from './cloudinary';

export const resolver = {
  ImageMediaSource: {
    uri: ({ uri = '' }) => {
      if (!uri || typeof uri !== 'string') return null;
      if (uri.startsWith('http')) return withCloudinary(uri);
      if (uri.startsWith('//')) return withCloudinary(`https:${uri}`);

      return uri;
    },
  },
};
