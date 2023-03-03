export const withTrackOnPress = (Component) => (props) =>
  <Component onPress={() => null} {...props} />;
export const AnalyticsConsumer = ({ children }) =>
  children({ track: () => null, notify: () => null });
