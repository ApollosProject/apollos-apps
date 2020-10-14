import FeaturesFeedConnected, {
  ACTION_MAP as FEATURE_FEED_ACTION_MAP,
} from './FeaturesFeedConnected';
import GET_FEATURE_FEED from './getFeatureFeed';

export featuresFeedComponentMapper from './featuresFeedComponentMapper';

export {
  FEATURE_FEED_ACTION_MAP,
  GET_FEATURE_FEED,
  // TODO: deprecated, warn on import and remove later
  GET_FEATURE_FEED as GET_FEED_FEATURES,
};
export default FeaturesFeedConnected;
