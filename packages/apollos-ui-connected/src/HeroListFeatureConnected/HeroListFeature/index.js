import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
  ActionList,
  HighlightCard,
  H3,
  H5,
  PaddedView,
  styled,
  TouchableScale,
} from '@apollosproject/ui-kit';
import { LiveConsumer } from '../../live';

const Header = styled(
  ({ theme }) => ({
    paddingTop: theme.sizing.baseUnit * 3,
    paddingBottom: 0,
  }),
  'ui-connected.HeroListFeatureConnected.HeroListFeature.Header'
)(PaddedView);

const Title = styled(
  ({ theme }) => ({
    color: theme.colors.text.tertiary,
  }),
  'ui-connected.HeroListFeatureConnected.HeroListFeature.Title'
)(H5);

const Subtitle = styled(
  {},
  'ui-connected.HeroListFeatureConnected.HeroListFeature.Subtitle'
)(H3);

const loadingStateArray = [
  {
    id: 'fakeId1',
    title: 'Boom',
    subtitle: 'What',
    parentChannel: {
      id: '',
      name: '',
    },
    image: {
      sources: [
        {
          uri: '',
        },
      ],
    },
  },
  {
    id: 'fakeId2',
    title: 'Boom',
    subtitle: 'What',
    parentChannel: {
      id: '',
      name: '',
    },
    image: {
      sources: [
        {
          uri: '',
        },
      ],
    },
  },
  {
    id: 'fakeId3',
    title: 'Boom',
    subtitle: 'What',
    parentChannel: {
      id: '',
      name: '',
    },
    image: {
      sources: [
        {
          uri: '',
        },
      ],
    },
  },
  {
    id: 'fakeId4',
    title: 'Boom',
    subtitle: 'What',
    parentChannel: {
      id: '',
      name: '',
    },
    image: {
      sources: [
        {
          uri: '',
        },
      ],
    },
  },
];

// TODO: Conrad is making this reusuable.
const HeroItemComponent = ({ Component, ...item }) => (
  <LiveConsumer contentId={item.id}>
    {(liveStream) => {
      const isLive = !!(liveStream && liveStream.isLive);
      const labelText = isLive ? 'Live' : item.labelText;
      return <Component isLive={isLive} {...item} labelText={labelText} />;
    }}
  </LiveConsumer>
);

HeroItemComponent.propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
    PropTypes.object,
  ]).isRequired,
};

const HeroListFeature = memo(
  ({
    actions = [],
    heroCard,
    id,
    isLoading,
    HeroComponent,
    loadingStateObject,
    onPressHero: onPressHeroProp,
    onPressHeroListButton,
    onPressItem,
    subtitle,
    title,
    primaryAction,
  }) => {
    const onPressHero = onPressHeroProp || onPressItem;
    const onPressActionListButton = onPressHeroListButton || onPressItem;
    return (
      !!(isLoading || actions.length || heroCard) && (
        <ActionList
          isCard={false}
          isLoading={isLoading}
          key={id}
          header={
            <>
              {isLoading || title || subtitle ? ( // only display the Header if we are loading or have a title/subtitle
                <Header>
                  {isLoading || title ? ( // we check for isloading here so that they are included in the loading state
                    <Title numberOfLines={1}>{title}</Title>
                  ) : null}
                  {isLoading || subtitle ? (
                    <Subtitle>{subtitle}</Subtitle>
                  ) : null}
                </Header>
              ) : null}
              {isLoading || heroCard ? (
                <TouchableScale onPress={() => onPressHero(heroCard)}>
                  <HeroItemComponent
                    {...heroCard}
                    actionIcon={
                      get(heroCard, 'actionIcon')
                        ? get(heroCard, 'actionIcon')
                        : undefined
                    }
                    coverImage={get(heroCard, 'coverImage.sources', undefined)}
                    __typename={get(heroCard, 'relatedNode.__typename')}
                    id={get(heroCard, 'relatedNode.id')}
                    Component={HeroComponent}
                    isLoading={isLoading}
                  />
                </TouchableScale>
              ) : null}
            </>
          }
          actions={isLoading && !actions.length ? loadingStateObject : actions}
          onPressActionItem={onPressItem}
          onPressActionListButton={() => onPressActionListButton(primaryAction)}
          actionListButtonTitle={get(primaryAction, 'title')}
        />
      )
    );
  }
);

HeroListFeature.displayName = 'Features';

HeroListFeature.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({})),
  heroCard: PropTypes.shape({}),
  id: PropTypes.string,
  isLoading: PropTypes.bool,
  HeroComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
    PropTypes.object,
  ]),
  primaryAction: PropTypes.shape({
    title: PropTypes.string,
    relatedNode: PropTypes.shape({}),
  }),
  loadingStateObject: PropTypes.arrayOf(PropTypes.shape({})),
  onPressHero: PropTypes.func,
  onPressHeroListButton: PropTypes.func,
  onPressItem: PropTypes.func,
  subtitle: PropTypes.string,
  title: PropTypes.string,
};

HeroListFeature.defaultProps = {
  HeroComponent: HighlightCard,
  loadingStateObject: loadingStateArray,
};

export default HeroListFeature;
