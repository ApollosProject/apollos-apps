import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import Card from '../Card';
import styled from '../styled';

export ActionBarItem from './ActionBarItem';

const Row = styled(
  {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  'ui-kit.ActionBar.Row'
)(View);

const ActionBar = ({ children, ...props }) => (
  <Card {...props}>
    <Row>{children}</Row>
  </Card>
);

ActionBar.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
};

export default ActionBar;
