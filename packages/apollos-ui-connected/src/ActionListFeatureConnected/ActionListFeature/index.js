import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { FeatureTitles, ActionList, PaddedView } from '@apollosproject/ui-kit';
import { get } from 'lodash';

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

    // Only render if loading or if you have actions
    return (
      !!(isLoading || actions.length) && (
        <ActionList
          isLoading={isLoading}
          key={id}
          header={
            <>
              <FeatureTitles
                title={title}
                subtitle={subtitle}
                isLoading={isLoading}
              />
              <PaddedView />
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

ActionListFeature.displayName = 'Features';

ActionListFeature.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({})),
  primaryAction: PropTypes.shape({}),
  id: PropTypes.string,
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
