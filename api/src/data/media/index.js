import { gql } from 'apollo-server';
import { Constants } from '/api/connectors/rock';
import { get } from 'lodash';

export { default as model } from './model';

export const schema = gql`
  enum VIDEO_FORMATS {
    IOS
    ANDROID
  }

  interface Media {
    name: String
    key: String
    sources: [MediaSource]
  }

  interface MediaSource {
    uri: String
  }

  type ImageMedia implements Media {
    name: String
    key: String
    sources: [ImageMediaSource]
  }

  type VideoMedia implements Media {
    name: String
    key: String
    sources: [VideoMediaSource]
    # duration: Float
    embedHtml: String
    videoUri(format: VIDEO_FORMATS): String
  }

  type AudioMedia implements Media {
    name: String
    key: String
    # duration: Float
    sources: [AudioMediaSource]
  }

  type AudioMediaSource implements MediaSource {
    uri: String
    # format: String
    # size: String
  }

  type ImageMediaSource implements MediaSource {
    uri: String
    # width: Int
    # height: Int
  }

  type VideoMediaSource implements MediaSource {
    uri: String
    # format: String
    # size: String
  }

  enum MediaInputType {
    IMAGE
    VIDEO
    AUDIO
  }
`;

export const resolver = {
  ImageMediaSource: {
    uri: ({ uri = '' }) => {
      if (!uri || typeof uri !== 'string') return null;
      if (uri.startsWith('http')) return uri;
      if (uri.startsWith('//')) return `https:${uri}`;

      // Handle Rock GUID:
      if (uri.split('-').length === 5)
        return `${Constants.GET_IMAGE}?guid=${uri}`;

      return uri;
    },
  },
  VideoMedia: {
    videoUri: (root, args, context) =>
      // in the future, we can extend to support additional platforms via args.format
      get(root, 'sources[0].uri'),
  },
};
