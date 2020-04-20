import React, { memo } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import {
  FeaturedCard,
  FeedView,
  H2,
  H5,
  PaddedView,
  styled,
  withIsLoading,
} from '@apollosproject/ui-kit';
import { LiveConsumer } from '..';

const Title = styled(
  ({ theme }) => ({
    color: theme.colors.text.tertiary,
  }),
  'CampaignItemListFeature.Title'
)(H5);

const Subtitle = styled({}, 'CampaignItemListFeature.Subtitle')(H2);

const Header = styled(({ theme }) => ({
  paddingTop: theme.sizing.baseUnit * 3,
  paddingBottom: theme.sizing.baseUnit * 0.5,
}))(PaddedView);

const ListItemComponent = ({ contentId, ...item }) => (
  <LiveConsumer contentId={contentId}>
    {(liveStream) => {
      const isLive = !!(liveStream && liveStream.isLive);
      const labelText = isLive ? 'Live' : item.labelText;
      return <FeaturedCard isLive={isLive} {...item} labelText={labelText} />;
    }}
  </LiveConsumer>
);

ListItemComponent.propTypes = {
  contentId: PropTypes.string,
};

const loadingStateData = {
  action: '',
  title: '',
  hasAction: true,
  actionIcon: 'umbrella',
  isLoading: true,
  labelText: '',
  summary: 'boom',
  coverImage: [
    {
      uri: '',
    },
  ],
  relatedNode: {
    id: '',
    __typename: '',
  },
  __typename: '',
};

const CampaignItemListFeature = memo(
  ({ cards, isLoading, listKey, onPressItem, subtitle, title }) => (
    <View>
      {isLoading || title || subtitle ? ( // only display the Header if we are loading or have a title/subtitle
        <Header vertical={false}>
          {isLoading || title ? ( // we check for isloading here so that they are included in the loading state
            <Title numberOfLines={1}>{title}</Title>
          ) : null}
          {isLoading || subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
        </Header>
      ) : null}
      <FeedView
        onPressItem={onPressItem}
        ListItemComponent={ListItemComponent}
        content={isLoading ? [loadingStateData] : cards}
        isLoading={isLoading}
        listKey={listKey}
      />
    </View>
  )
);

CampaignItemListFeature.displayName = 'Features';

CampaignItemListFeature.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  isLoading: PropTypes.bool,
  listKey: PropTypes.string,
  loadingStateObject: PropTypes.shape({}),
  onPressItem: PropTypes.func,
  subtitle: PropTypes.string,
  title: PropTypes.string,
};

CampaignItemListFeature.defaultProps = {
  loadingStateObject: loadingStateData,
};

export default withIsLoading(CampaignItemListFeature);
