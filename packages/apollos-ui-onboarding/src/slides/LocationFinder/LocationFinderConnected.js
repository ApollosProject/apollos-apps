import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { AnalyticsConsumer } from '@apollosproject/ui-analytics';
import Permissions from 'react-native-permissions';
import GET_USER_CAMPUS from './getUserCampus';
import LocationFinder from './LocationFinder';

class LocationFinderConnected extends PureComponent {
  state = { selectedCampus: false, locationPermission: false };

  componentDidMount() {
    Permissions.check('location').then((response) => {
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      this.setState({ locationPermission: response === 'authorized' });
    });
  }

  render() {
    return (
      <Query query={GET_USER_CAMPUS} fetchPolicy="cache-and-network">
        {({
          data: {
            currentUser: {
              profile: { campus } = {
                campus: {},
              },
            } = {},
          } = {},
        }) => (
          <AnalyticsConsumer>
            {({ track }) => (
              <this.props.Component
                onPressButton={() => {
                  this.setState({ selectedCampus: true });
                  this.props.onNavigate();
                  track({ eventName: 'LocationFinder Opened MapView' });
                }}
                // Next button
                onPressPrimary={
                  campus && this.state.locationPermisson
                    ? this.props.onPressPrimary
                    : null
                }
                // Skip button
                onPressSecondary={
                  !campus || !this.state.locationPermission
                    ? this.props.onPressPrimary
                    : null
                }
                pressPrimaryEventName={'Ask Location Completed'}
                pressSecondaryEventName={'Ask Location Skipped'}
                buttonText={'Yes, find my local campus'}
                campus={campus && this.state.locationPermission ? campus : null}
                {...this.props}
              />
            )}
          </AnalyticsConsumer>
        )}
      </Query>
    );
  }
}

LocationFinderConnected.propTypes = {
  // Custom component to be rendered. Defaults to LocationFinder
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object,
  ]),
  onPressPrimary: PropTypes.func,
  onNavigate: PropTypes.func.isRequired,
};

LocationFinderConnected.defaultProps = {
  Component: LocationFinder,
};

LocationFinderConnected.displayName = 'LocationFinderConnected';

export default LocationFinderConnected;
