import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { styled, ActionList, H3, H5 } from '@apollosproject/ui-kit';
import { get } from 'lodash';

const Title = styled(
  ({ theme }) => ({
    color: theme.colors.text.tertiary,
  }),
  'ui-connected.ActionListFeatureConnected.ActionListFeature.Title'
)(H5);

const Subtitle = styled(
  {},
  'ui-connected.ActionListFeatureConnected.ActionListFeature.Subtitle'
)(H3);

const ActionListHeader = styled(
  ({
    theme: {
      sizing: { baseUnit },
    },
  }) => ({
    paddingHorizontal: baseUnit,
    paddingTop: baseUnit,
    // Padding Bottom is baked into the card content
  }),
  'ui-connected.ActionListFeatureConnected.ActionListFeature.ActionListHeader'
)(View);

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

const ActionListFeature = memo(
  ({
    actions,
    id,
    isLoading,
    loadingStateObject,
    onPressActionListButton: onPressActionListButtonProp,
    onPressItem,
    subtitle,
    title,
    primaryAction,
  }) => {
    const onPressActionListButton = onPressActionListButtonProp || onPressItem;
    const HeaderWrapper =
      isLoading || title || subtitle ? ActionListHeader : View;

    // Only render if loading or if you have actions
    return (
      !!(isLoading || actions.length) && (
        <ActionList
          isLoading={isLoading}
          key={id}
          header={
            <HeaderWrapper>
              {isLoading || title ? ( // we check for isloading here so that they are included in the loading state
                <Title numberOfLines={1}>{title}</Title>
              ) : null}
              {isLoading || subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
            </HeaderWrapper>
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

ActionListFeature.displayName = 'Features';

ActionListFeature.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({})),
  primaryAction: PropTypes.shape({}),
  id: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  loadingStateObject: PropTypes.arrayOf(PropTypes.shape({})),
  onPressActionListButton: PropTypes.func,
  onPressItem: PropTypes.func,
  subtitle: PropTypes.string,
  title: PropTypes.string,
};

ActionListFeature.defaultProps = {
  loadingStateObject: loadingStateArray,
  actions: [],
};

export default ActionListFeature;
