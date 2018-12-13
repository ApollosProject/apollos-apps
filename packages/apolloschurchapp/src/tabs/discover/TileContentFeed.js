import React from 'react';
import { View } from 'react-native';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';

import {
  PaddedView,
  H4,
  HorizontalTileFeed,
  styled,
  withTheme,
  ButtonLink,
  TouchableScale,
} from '@apollosproject/ui-kit';

import ContentCardConnected from '../../ui/ContentCardConnected';

const RowHeader = styled({
const RowHeader = styled(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  zIndex: 2, // UX hack to improve tapability. Positions RowHeader above StyledHorizontalTileFeed
})(PaddedView);
  paddingLeft: theme.sizing.baseUnit,
}))(View);

const Name = styled({
  flexGrow: 2,
})(View);

const AndroidTouchableFix = withTheme(({ theme }) => ({
  borderRadius: theme.sizing.baseUnit / 2,
}))(Touchable);

const ButtonLinkSpacing = styled(({ theme }) => ({
  flexDirection: 'row', // correctly positions the loading state
  justifyContent: 'flex-end', // correctly positions the loading state
  padding: theme.sizing.baseUnit, // UX hack to improve tapability.
}))(View);

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
    <RowHeader>
      <Name>
        <H5 isLoading={isLoading}>{name}</H5>
      </Name>
      <AndroidTouchableFix
        onPress={() => {
          navigation.navigate('ContentFeed', {
            itemId: id,
            itemTitle: name,
          });
        }}
      >
        <ButtonLinkSpacing>
          <H6>
            <ButtonLink>View All</ButtonLink>
          </H6>
        </ButtonLinkSpacing>
      </AndroidTouchableFix>
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

export default withNavigation(withIsLoading(TileContentFeed));
