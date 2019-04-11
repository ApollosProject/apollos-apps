import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { withNavigation } from 'react-navigation';
import getUserCampus from './getUserCampus';
import LocationFinder from '.';

class LocationFinderConnected extends PureComponent {
  state = { selectedCampus: false };

  render() {
    const { onPressPrimary, navigation } = this.props;
    const { selectedCampus } = this.state;
    return (
      <Query query={getUserCampus} fetchPolicy="cache-and-network">
        {({
          data: {
            currentUser: {
              profile: { campus } = {
                campus: {},
              },
            } = {},
          } = {},
        }) => (
          <LocationFinder
            onPressButton={async () => {
              this.setState({ selectedCampus: true });
              navigation.navigate('LocationFinderMapView', {
                onFinished: onPressPrimary,
              });
            }}
            buttonText={'Yes, find my local campus'}
            campus={selectedCampus ? campus : null}
            onPressPrimary={onPressPrimary}
            {...this.props}
          />
        )}
      </Query>
    );
  }
}

LocationFinderConnected.propTypes = {
  onPressPrimary: PropTypes.func.isRequired,
};

LocationFinderConnected.displayName = 'LocationFinderConnected';

export default withNavigation(LocationFinderConnected);
