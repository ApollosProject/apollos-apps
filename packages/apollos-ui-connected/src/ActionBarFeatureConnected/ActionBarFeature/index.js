import React from 'react';
import {
  ActionBar,
  ActionBarItem,
  H4,
  styled,
  PaddedView,
  withTheme,
} from '@apollosproject/ui-kit';
import PropTypes from 'prop-types';

const ActionBarHeader = styled(
  {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  'ui-connected.ActionBarFeatureConnected.ActionBarHeader'
)(PaddedView);

const ActionBarFeature = ({ actions, title, onPressItem }) => (
  <>
    {title && (
      <ActionBarHeader vertical={false}>
        <H4>{title}</H4>
      </ActionBarHeader>
    )}
    <ActionBar>
      {actions.map((item) => (
        <ActionBarItem
          key={item.id}
          onPress={() => onPressItem(item)}
          icon={item.icon}
          label={item.title}
        />
      ))}
    </ActionBar>
  </>
);

ActionBarFeature.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  title: PropTypes,
  onPressItem: PropTypes.func,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
      label: PropTypes.string,
      icon: PropTypes.string,
    })
  ),
};

export default withTheme(
  () => ({}),
  'ui-connected.ActionBarFeatureConnected.ActionBarFeature'
)(ActionBarFeature);
