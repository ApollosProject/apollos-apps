import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
  ActionList,
  HighlightCard,
  H3,
  H6,
  PaddedView,
  styled,
  TouchableScale,
} from '@apollosproject/ui-kit';
import { LiveConsumer } from '../..';

const Header = styled(({ theme }) => ({
  paddingTop: theme.sizing.baseUnit * 3,
  paddingBottom: 0,
}))(PaddedView);

const Title = styled(
  ({ theme }) => ({
    color: theme.colors.text.tertiary,
  }),
  'HeroListFeature.Title'
)(H6);

const Subtitle = styled({}, 'HeroListFeature.Subtitle')(H3);

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

const HeroListFeature = memo(
  ({
    actions = [],
    hero,
    id,
    isLoading,
    HeroComponent,
    loadingStateObject,
    onPressHero: onPressHeroProp,
    onPressHeroListButton,
    onPressItem,
    subtitle,
    title,
  }) => {
    const onPressHero = onPressHeroProp || onPressItem;
    return (
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
                {isLoading || subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
              </Header>
            ) : null}
            <TouchableScale onPress={() => onPressHero(hero)}>
              <HeroItemComponent
                {...hero}
                actionIcon={
                  get(hero, 'actionIcon') ? get(hero, 'actionIcon') : undefined
                }
                coverImage={get(hero, 'coverImage.sources', undefined)}
                __typename={get(hero, 'relatedNode.__typename')}
                id={get(hero, 'relatedNode.id')}
                Component={HeroComponent}
              />
            </TouchableScale>
          </>
        }
        actions={isLoading && !actions.length ? loadingStateObject : actions}
        onPressActionItem={onPressItem}
        // Disabled until we support
        onPressActionListButton={onPressItem || onPressHeroListButton}
      />
    );
  }
);

HeroListFeature.displayName = 'Features';

HeroListFeature.propTypes = {
  // TODO: refactor ActionListCard to safely render without an actions array.
  actions: PropTypes.arrayOf(PropTypes.shape({})).isRequired, // at least for the time being this is required
  hero: PropTypes.shape({}).isRequired, // at least for the time being this is required
  id: PropTypes.number,
  isLoading: PropTypes.bool,
  HeroComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
    PropTypes.object,
  ]),
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
