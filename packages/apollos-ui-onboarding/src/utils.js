/* eslint-disable import/prefer-default-export, react/prop-types */
import React from 'react';
import { AnalyticsConsumer } from '@apollosproject/ui-analytics';

export const withOnPressAnalytics = (Component, { displayName } = {}) => ({
  onPressPrimary,
  onPressSecondary,
  ...props
}) => (
  <AnalyticsConsumer>
    {({ track }) => {
      if (!Component.displayName && !displayName) {
        console.warn(`
          The component rendered by withOnPressAnalytics must have a display name,
          or you should pass \`{ displayName }\` as the second argument to withOnPressAnalytics.
          Otherwise your analytics events will show up as "undefined Skipped"
         `);
      }
      const handlePressPrimary = () => {
        onPressPrimary();
        track({
          eventName: `${Component.displayName || displayName} Completed`,
        });
      };

      const handlePressSecondary = () => {
        onPressSecondary();
        track({ eventName: `${Component.displayName || displayName} Skipped` });
      };
      return (
        <Component
          onPressPrimary={onPressPrimary && handlePressPrimary}
          onPressSecondary={onPressSecondary && handlePressSecondary}
          track={track}
          {...props}
        />
      );
    }}
  </AnalyticsConsumer>
);
