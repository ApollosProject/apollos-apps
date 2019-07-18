import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { AnalyticsConsumer } from '@apollosproject/ui-analytics';
import GET_USER_CAMPUS from './getUserCampus';
import LocationFinder from './LocationFinder';

class LocationFinderConnected extends PureComponent {
  state = { selectedCampus: false };

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
                onPressButton={async () => {
                  this.setState({ selectedCampus: true });
                  this.props.onNavigate();
                  track({ eventName: 'LocationFinder Opened MapView' });
                }}
                // Next button
                onPressPrimary={campus ? this.props.onPressPrimary : null}
                // Skip button
                onPressSecondary={!campus ? this.props.onPressPrimary : null}
                pressPrimaryEventName={'Ask Location Completed'}
                pressSecondaryEventName={'Ask Location Skipped'}
                buttonText={'Yes, find my local campus'}
                campus={this.state.selectedCampus ? campus : null}
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
