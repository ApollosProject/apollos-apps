import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { AnalyticsConsumer } from '@apollosproject/ui-analytics';
import { hasLocationPermission } from '@apollosproject/ui-mapview';
import GET_USER_CAMPUS from './getUserCampus';
import LocationFinder from './LocationFinder';

const LocationFinderConnected = ({ Component, onPressPrimary, ...props }) => {
  const navigation = useNavigation();
  const [locationPermission, setLocationPermission] = useState(false);

  const checkPermission = async () => {
    const permission = await hasLocationPermission();
    setLocationPermission(permission);
  };

  const { data } = useQuery(GET_USER_CAMPUS, {
    fetchPolicy: 'cache-and-network',
  });

  return (
    <AnalyticsConsumer>
      {({ track }) => {
        const showNextBtn = !!(
          data?.currentUser?.profile?.campus && locationPermission
        );

        return (
          <Component
            onPressButton={async () => {
              await checkPermission();
              navigation.navigate('Location');
              track({ eventName: 'LocationFinder Opened MapView' });
            }}
            // next button
            onPressPrimary={showNextBtn ? onPressPrimary : null}
            // skip button
            onPressSecondary={!showNextBtn ? onPressPrimary : null}
            pressPrimaryEventName={'Ask Location Completed'}
            pressSecondaryEventName={'Ask Location Skipped'}
            buttonText={'Yes, find my local campus'}
            campus={data?.currentUser?.profile?.campus}
            {...props}
          />
        );
      }}
    </AnalyticsConsumer>
  );
};

LocationFinderConnected.propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object, // type check for React fragments
  ]),
  onPressPrimary: PropTypes.func,
};

LocationFinderConnected.defaultProps = {
  Component: LocationFinder,
};

LocationFinderConnected.displayName = 'LocationFinderConnected';

export default LocationFinderConnected;
