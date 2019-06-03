/* eslint-disable react/prop-types */
import React from 'react';
import { AnalyticsConsumer } from './Provider';

// eslint-disable-next-line react/display-name, react/prop-types
const withTrackOnPress = (Component) => ({
  trackEventName,
  trackProperties = {},
  onPress,
  ...props
}) => {
  // no reason to include the provider if we don't need it.
  if (trackEventName == null) {
    return <Component {...props} onPress={onPress} />;
  }

  return (
    <AnalyticsConsumer>
      {({ track }) => {
        const handleOnPress = () => {
          track({ eventName: trackEventName, properties: trackProperties });
          return onPress && onPress();
        };
        return <Component {...props} onPress={handleOnPress} />;
      }}
    </AnalyticsConsumer>
  );
};

export default withTrackOnPress;
