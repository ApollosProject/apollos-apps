import React from 'react';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';

import {
  PaddedView,
  H4,
  HorizontalTileFeed,
  styled,
  ButtonLink,
  TouchableScale,
} from '@apollosproject/ui-kit';

import ContentCardConnected from '../../ui/ContentCardConnected';

const RowHeader = styled({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  zIndex: 2, // UX hack to improve tapability. Positions RowHeader above StyledHorizontalTileFeed
})(PaddedView);

const StyledButtonLink = styled(({ theme }) => ({
  /* UX hack to improve tapability. The following styles intentionally pad and move the button
   * around to allow for us to increase its tappable area. */
  padding: theme.sizing.baseUnit,
  marginRight: theme.sizing.baseUnit * -1,
}))(ButtonLink);

const StyledHorizontalTileFeed = styled(({ theme }) => ({
  /* UX hack to improve tapability. The magic number below happens to be the number of pixels that
   * aligns everything in the same place as if none of the UX hacks were there. */
  marginTop: theme.sizing.baseUnit * -0.625,
  zIndex: 1,
}))(HorizontalTileFeed);

const loadingStateObject = {
  id: 'fake_id',
  title: '',
  coverImage: [],
};

const TileContentFeed = ({ isLoading, id, name, navigation, content = [] }) => (
  <PaddedView horizontal={false}>
    <RowHeader vertical={false}>
      <H4 isLoading={isLoading}>{name}</H4>
      {!isLoading ? (
        <StyledButtonLink
          onPress={() => {
            navigation.navigate('ContentFeed', {
              itemId: id,
              itemTitle: name,
            });
          }}
        >
          View All
        </StyledButtonLink>
      ) : null}
    </RowHeader>
    <StyledHorizontalTileFeed
      content={content}
      renderItem={({ item }) => (
        <TouchableScale
          onPress={() => {
            navigation.push('ContentSingle', {
              itemId: item.id,
            });
          }}
        >
          <ContentCardConnected
            contentId={item.id}
            isLoading={isLoading}
            tile
            inHorizontalList
          />
        </TouchableScale>
      )}
      loadingStateObject={loadingStateObject}
      isLoading={isLoading}
    />
  </PaddedView>
);

TileContentFeed.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  isLoading: PropTypes.bool,
  id: PropTypes.string,
  name: PropTypes.string,
  content: PropTypes.arrayOf(
    PropTypes.any // this component doesn't care about the shape of `node`, just that it exists
  ),
};

export default withNavigation(TileContentFeed);
