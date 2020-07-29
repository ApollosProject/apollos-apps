import AnalyticsProvider, {
  AnalyticsConsumer,
  AnalyticsContext,
  identify,
  track,
} from './Provider';
import TrackEventWhenLoaded from './TrackEventWhenLoaded';
import withTrackOnPress from './withTrackOnPress';
import CoreNavigationAnalytics from './CoreNavigationAnalytics';

export {
  AnalyticsConsumer,
  AnalyticsContext,
  AnalyticsProvider,
  CoreNavigationAnalytics,
  identify,
  track,
  TrackEventWhenLoaded,
  withTrackOnPress,
};
