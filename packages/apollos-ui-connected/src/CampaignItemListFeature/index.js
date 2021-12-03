import React, { memo } from 'react';
import PropTypes from 'prop-types';
import {
  DefaultCard,
  FeedView,
  PaddedView,
  styled,
  withIsLoading,
  FeatureTitles,
  named,
} from '@apollosproject/ui-kit';

import { LiveConsumer } from '../live';

const Header = styled(
  ({ theme }) => ({
    paddingTop: theme.sizing.baseUnit * 3,
    paddingBottom: theme.sizing.baseUnit * 0.5,
  }),
  'ui-connected.CampaignItemListFeature.Header'
)(PaddedView);

const ListItemComponent = named('CampaignItemListFeature.ListItemComponent')(
  ({ Component, contentId, labelText, ...item }) => (
    <LiveConsumer contentId={contentId}>
      {(liveStream) => {
        const isLive = !!(liveStream && liveStream.isLive);
        return (
          <Component
            {...(isLive
              ? {
                  isLive,
                }
              : { isLive, labelText })} // we only want to pass `labelText` if we are NOT live. If we do we will override the default logic in the FeaturedCard
            {...item}
            isFeatured
          />
        );
      }}
    </LiveConsumer>
  )
);

ListItemComponent.propTypes = {
  contentId: PropTypes.string,
  labelText: PropTypes.string,
  Component: PropTypes.func,
};

ListItemComponent.defaultProps = {
  Component: DefaultCard,
};

const loadingStateData = {
  action: '',
  title: '',
  hasAction: true,
  actionIcon: 'umbrella',
  isLoading: true,
  labelText: '',
  summary: '',
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
  ({ cards, isLoading, listKey, onPressItem, subtitle, title }) =>
    !!(isLoading || cards.length) && (
      <FeedView
        onPressItem={onPressItem}
        ListItemComponent={ListItemComponent}
        ListHeaderComponent={
          isLoading || title || subtitle ? ( // only display the Header if we are loading or have a title/subtitle
            <Header vertical={false}>
              <FeatureTitles
                isLoading={isLoading}
                subtitle={subtitle}
                title={title}
              />
            </Header>
          ) : null
        }
        content={isLoading ? [loadingStateData] : cards}
        isLoading={isLoading}
        listKey={listKey}
      />
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
