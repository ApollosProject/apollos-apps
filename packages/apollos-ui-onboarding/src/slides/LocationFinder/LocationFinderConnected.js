import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query } from '@apollo/client/react/components';
import { AnalyticsConsumer } from '@apollosproject/ui-analytics';
import { hasLocationPermission } from '@apollosproject/ui-mapview';
import GET_USER_CAMPUS from './getUserCampus';
import LocationFinder from './LocationFinder';

class LocationFinderConnected extends PureComponent {
  state = { locationPermission: false };

  async checkPermission() {
    const locationPermission = await hasLocationPermission();
    this.setState({ locationPermission });
  }

  render() {
    return (
      <Query query={GET_USER_CAMPUS} fetchPolicy="cache-and-network">
        {({
          data: { currentUser: { profile: { campus } = {} } = {} } = {},
        }) => {
          return (
            <AnalyticsConsumer>
              {({ track }) => {
                const { onPressPrimary, ...otherProps } = this.props;
                const showNextBtn = !!(campus && this.state.locationPermission);

                const { Component: MapViewComponent } = this.props;

                return (
                  <MapViewComponent
                    onPressButton={async () => {
                      await this.checkPermission();
                      this.props.onNavigate();

                      track({ eventName: 'LocationFinder Opened MapView' });
                    }}
                    // next button
                    onPressPrimary={showNextBtn ? onPressPrimary : null}
                    // skip button
                    onPressSecondary={!showNextBtn ? onPressPrimary : null}
                    pressPrimaryEventName={'Ask Location Completed'}
                    pressSecondaryEventName={'Ask Location Skipped'}
                    buttonText={'Yes, find my local campus'}
                    campus={campus}
                    {...otherProps}
                  />
                );
              }}
            </AnalyticsConsumer>
          );
        }}
      </Query>
    );
  }
}

LocationFinderConnected.propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object, // type check for React fragments
  ]),
  onPressPrimary: PropTypes.func,
  onNavigate: PropTypes.func.isRequired,
};

LocationFinderConnected.defaultProps = {
  Component: LocationFinder,
};

LocationFinderConnected.displayName = 'LocationFinderConnected';

export default LocationFinderConnected;
