import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { styled, ActionListCard, H3, H6 } from '@apollosproject/ui-kit';

const Title = styled(
  ({ theme }) => ({
    color: theme.colors.text.tertiary,
  }),
  'ActionListFeature.Title'
)(H6);

const Subtitle = styled({}, 'ActionListFeature.Subtitle')(H3);

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
    onPressActionListButton,
    onPressActionItem,
    subtitle,
    title,
  }) => (
    <ActionListCard
      isLoading={isLoading}
      key={id}
      header={
        <>
          {isLoading || title ? ( // we check for isloading here so that they are included in the loading state
            <Title numberOfLines={1}>{title}</Title>
          ) : null}
          {isLoading || subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
        </>
      }
      actions={isLoading && !actions.length ? loadingStateObject : actions}
      onPressActionItem={onPressActionItem}
      onPressActionListButton={onPressActionListButton}
    />
  )
);

ActionListFeature.displayName = 'Features';

ActionListFeature.propTypes = {
  // TODO: refactor ActionListCard to safely render without an actions array.
  actions: PropTypes.arrayOf(PropTypes.shape({})).isRequired, // at least for the time being this is required
  id: PropTypes.number,
  isLoading: PropTypes.bool,
  loadingStateObject: PropTypes.arrayOf(PropTypes.shape({})),
  onPressActionListButton: PropTypes.func,
  onPressActionItem: PropTypes.func,
  subtitle: PropTypes.string,
  title: PropTypes.string,
};

ActionListFeature.defaultProps = {
  loadingStateObject: loadingStateArray,
};

export default ActionListFeature;
