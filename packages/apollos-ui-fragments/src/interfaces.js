import { gql } from '@apollo/client';

const AUDIO_NODE_FRAGMENT = gql`
  fragment AudioNodeFragment on AudioNode {
    audios {
      sources {
        uri
      }
    }
  }
`;

const VIDEO_NODE_FRAGMENT = gql`
  fragment VideoNodeFragment on VideoNode {
    videos {
      name
      sources {
        uri
      }
    }
  }
`;

const LIVE_NODE_FRAGMENT = gql`
  fragment LiveNodeFragment on LiveNode {
    liveStream {
      isLive
      media {
        sources {
          uri
        }
      }
    }
  }
`;

const SCRIPTURE_NODE_FRAGMENT = gql`
  fragment ScriptureNodeFragment on ScriptureNode {
    scriptures {
      ...ScriptureFragment
    }
  }
`;

const CONTENT_NODE_FRAGMENT = gql`
  fragment ContentNodeFragment on ContentNode {
    title
    htmlContent
    coverImage {
      sources {
        uri
      }
    }
  }
`;

const FEATURES_NODE_FRAGMENT = gql`
  fragment FeaturesNodeFragment on FeaturesNode {
    features {
      ...FeaturesFragment
    }
  }
`;

const CARD_NODE_FRAGMENT = gql`
  fragment CardNodeFragment on Card {
    title
    hyphenatedTitle: title(hyphenated: true)
    summary
    coverImage {
      sources {
        uri
      }
    }
  }
`;

const THEMED_NODE_FRAGMENT = gql`
  fragment ThemedNodeFragment on ThemedNode {
    theme {
      type
      colors {
        primary
        secondary
        screen
        paper
      }
    }
  }
`;

export {
  AUDIO_NODE_FRAGMENT,
  VIDEO_NODE_FRAGMENT,
  LIVE_NODE_FRAGMENT,
  SCRIPTURE_NODE_FRAGMENT,
  CONTENT_NODE_FRAGMENT,
  FEATURES_NODE_FRAGMENT,
  CARD_NODE_FRAGMENT,
  THEMED_NODE_FRAGMENT,
};
