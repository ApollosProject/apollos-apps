import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { AnalyticsConsumer } from '@apollosproject/ui-analytics';
import Permissions from 'react-native-permissions';
import GET_USER_CAMPUS from './getUserCampus';
import LocationFinder from './LocationFinder';

class LocationFinderConnected extends PureComponent {
  state = { locationPermission: false };

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
        }) => {
          const nextBtn = campus && this.state.locationPermission;
          return (
            <AnalyticsConsumer>
              {({ track }) => (
                <this.props.Component
                  onPressButton={() => {
                    this.props.onNavigate();
                    track({ eventName: 'LocationFinder Opened MapView' });
                  }}
                  // next button
                  onPressPrimary={nextBtn ? this.props.onPressPrimary : null}
                  // skip button
                  onPressSecondary={!nextBtn ? this.props.onPressPrimary : null}
                  pressPrimaryEventName={'Ask Location Completed'}
                  pressSecondaryEventName={'Ask Location Skipped'}
                  buttonText={'Yes, find my local campus'}
                  campus={nextBtn ? campus : null}
                  {...this.props}
                />
              )}
            </AnalyticsConsumer>
          );
        }}
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
