import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import { UIText } from 'ui/typography';
import Card, { CardContent, ErrorCard } from 'ui/Card';
import Touchable from 'ui/Touchable';
import styled from 'ui/styled';
import ChannelLabel from 'ui/ChannelLabel';

import getLiveData from './getLiveData.graphql';

const LiveCard = styled(({ theme }) => ({
  backgroundColor: theme.colors.lightSecondary,
}))(Card);

class LiveNowButton extends PureComponent {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }),
  };

  render() {
    return (
      <Query query={getLiveData}>
        {({ loading, error, data }) => {
          if (error) return <ErrorCard error={error} />;
          const isLive = get(data, 'live.live', false);
          return (
            <Touchable onPress={() => this.props.navigation.navigate('Live')}>
              {isLive ? (
                <LiveCard isLoading={loading}>
                  <CardContent>
                    <ChannelLabel
                      icon="video"
                      label={
                        <UIText>
                          <UIText bold>{`We're live. `}</UIText>
                          Watch now!
                        </UIText>
                      }
                    />
                  </CardContent>
                </LiveCard>
              ) : null}
            </Touchable>
          );
        }}
      </Query>
    );
  }
}

export default withNavigation(LiveNowButton);
