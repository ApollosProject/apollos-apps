import React from 'react';
import { Platform, SafeAreaView } from 'react-native';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

import Share from 'apolloschurchapp/src/ui/Share';

import SideBySideView from 'apolloschurchapp/src/ui/SideBySideView';
import LikeButton from 'apolloschurchapp/src/ui/LikeButton';
import styled from 'apolloschurchapp/src/ui/styled';

import updateLikeEntity from './updateLikeEntity';
import getLikedContentItem from './getLikedContentItem';
import getShareContent from './getShareContent';

const PositioningView = styled(({ theme }) => ({
  justifyContent: 'space-around',
  paddingVertical: theme.sizing.baseUnit / 2,
  paddingHorizontal: theme.sizing.baseUnit,
}))(SideBySideView);

const Container = styled(({ theme }) => ({
  backgroundColor: theme.colors.paper,
  ...Platform.select(theme.shadows.default),
}))(SafeAreaView);

const ActionContainer = ({ itemId }) => (
  <Container>
    <PositioningView>
      <LikeButton
        itemId={itemId}
        updateLikeEntity={updateLikeEntity}
        getLikedContentItem={getLikedContentItem}
      />
      <Query query={getShareContent} variables={{ itemId }}>
        {({ data: { node: { sharing = {} } = {} } = {}, error, loading }) =>
          loading || error ? null : <Share content={sharing} />
        }
      </Query>
    </PositioningView>
  </Container>
);

ActionContainer.propTypes = {
  content: PropTypes.shape({}),
  itemId: PropTypes.string,
};

export default ActionContainer;
