import AnalyticsProvider, { AnalyticsConsumer } from './Provider';
import TrackEventWhenLoaded from './TrackEventWhenLoaded';
import {
  track as trackMutation,
  identify as identifyMutation,
} from './clientMutations';

export {
  trackMutation,
  identifyMutation,
  AnalyticsConsumer,
  AnalyticsProvider,
  TrackEventWhenLoaded,
};
