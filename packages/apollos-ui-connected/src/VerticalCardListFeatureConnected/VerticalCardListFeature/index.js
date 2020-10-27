import React, { memo } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import {
  FeedView,
  H3,
  H5,
  PaddedView,
  styled,
  withIsLoading,
} from '@apollosproject/ui-kit';

import { ContentCardComponentMapper } from '../../ContentCardConnected';

const Title = styled(
  ({ theme }) => ({
    color: theme.colors.text.tertiary,
  }),
  'ui-connected.VerticalCardListFeatureConnected.VerticalCardListFeature.Title'
)(H5);

const Subtitle = styled(
  {},
  'ui-connected.VerticalCardListFeatureConnected.VerticalCardListFeature.Subtitle'
)(H3);

const Header = styled(
  ({ theme }) => ({
    paddingTop: theme.sizing.baseUnit * 3,
    paddingBottom: theme.sizing.baseUnit * 0.5,
  }),
  'ui-connected.VerticalCardListFeatureConnected.VerticalCardListFeature.Header'
)(PaddedView);

// const getContent = ({ cards, isLoading }) => {
//   let content = [];
//   if (isLoading && !cards.length) {
//     content = [
//       {
//         id: 'fakeId0',
//         isLoading: true,
//         title: 'Test',
//         summary: 'Boom',
//         channelType: '',
//         coverImage: [],
//         parentChannel: {
//           id: '',
//           name: '',
//         },
//       },
//     ];
//   } else {
//     content = cards.map((card) => ({
//       ...card,
//       coverImage: get(card, 'coverImage.sources', undefined),
//       __typename: card.relatedNode.__typename,
//     }));
//   }
//
//   return content;
// };

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
          <Header vertical={false}>
            {isLoading || title ? ( // we check for isloading here so that they are included in the loading state
              <Title numberOfLines={1}>{title}</Title>
            ) : null}
            {isLoading || subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
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
