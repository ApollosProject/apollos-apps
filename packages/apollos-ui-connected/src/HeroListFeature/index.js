import React, { memo } from 'react';
import PropTypes from 'prop-types';

import {
  ActionList,
  HighlightCard,
  H3,
  H6,
  PaddedView,
  styled,
  TouchableScale,
} from '@apollosproject/ui-kit';

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

const HeroListFeature = memo(
  ({
    actions,
    id,
    isLoading,
    HeroComponent,
    loadingStateObject,
    onPressHero,
    onPressHeroListButton,
    onPressItem,
    subtitle,
    title,
  }) => (
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
          <TouchableScale onPress={onPressHero}>
            <HeroComponent />
          </TouchableScale>
        </>
      }
      actions={isLoading && !actions.length ? loadingStateObject : actions}
      onPressActionItem={onPressItem}
      onPressActionListButton={onPressHeroListButton}
    />
  )
);

HeroListFeature.displayName = 'Features';

HeroListFeature.propTypes = {
  // TODO: refactor ActionListCard to safely render without an actions array.
  actions: PropTypes.arrayOf(PropTypes.shape({})).isRequired, // at least for the time being this is required
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
