import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { get } from 'lodash';
import {
  ActionList,
  DefaultCard,
  PaddedView,
  TouchableScale,
  FeatureTitles,
} from '@apollosproject/ui-kit';
import { LiveConsumer } from '../../live';

const loadingStateArray = [
  {
    id: 'fakeId1',
    title: '',
    subtitle: '',
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
    title: '',
    subtitle: '',
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
    title: '',
    subtitle: '',
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
    title: '',
    subtitle: '',
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

// we use a stylesheet instead of styled here so that we can just
// pass DefaultCard as the HeroComponent below, and then pass style
// into it - that way it's easier to swap out for other cards.
const styles = StyleSheet.create({
  heroItemComponent: {
    marginHorizontal: 0,
    marginTop: 0,
  },
});

// TODO: Conrad is making this reusuable.
const HeroItemComponent = ({ Component, ...item }) => (
  <LiveConsumer contentId={item.id}>
    {(liveStream) => {
      const isLive = !!(liveStream && liveStream.isLive);
      const labelText = isLive ? 'Live' : item.labelText;
      return (
        <Component
          isLive={isLive}
          {...item}
          labelText={labelText}
          style={styles.heroItemComponent}
        />
      );
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
                <>
                  <FeatureTitles
                    title={title}
                    subtitle={subtitle}
                    isLoading={isLoading}
                  />
                  <PaddedView />
                </>
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
  loadingStateObject: loadingStateArray,
  HeroComponent: DefaultCard,
};

export default HeroListFeature;
