import React, { memo } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import {
  FeedView,
  PaddedView,
  styled,
  withIsLoading,
  FeatureTitles,
} from '@apollosproject/ui-kit';

import { ContentCardComponentMapper } from '../../ContentCardConnected';

const Header = styled(
  ({ theme }) => ({
    paddingTop: theme.sizing.baseUnit,
    paddingBottom: 0,
  }),
  'ui-connected.VerticalCardListFeatureConnected.VerticalCardListFeature.Header'
)(PaddedView);

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

const VerticalCardListFeature = memo(
  ({
    cards,
    isLoading,
    listKey,
    loadingStateObject,
    onPressItem,
    subtitle,
    title,
  }) =>
    !!(isLoading || cards.length) && (
      <View>
        {isLoading || title || subtitle ? ( // only display the Header if we are loading or have a title/subtitle
          <Header>
            <FeatureTitles
              title={title}
              subtitle={subtitle}
              isLoading={isLoading}
            />
          </Header>
        ) : null}
        <FeedView
          onPressItem={onPressItem}
          ListItemComponent={ContentCardComponentMapper}
          loadingStateObject={loadingStateObject}
          content={cards} // {getContent({ cards, isLoading })}
          isLoading={isLoading}
          listKey={listKey}
        />
      </View>
    )
);

VerticalCardListFeature.displayName = 'Features';

VerticalCardListFeature.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  isLoading: PropTypes.bool,
  listKey: PropTypes.string,
  loadingStateObject: PropTypes.shape({}),
  onPressItem: PropTypes.func,
  subtitle: PropTypes.string,
  title: PropTypes.string,
};

VerticalCardListFeature.defaultProps = {
  loadingStateObject: loadingStateData,
};

export default withIsLoading(VerticalCardListFeature);
