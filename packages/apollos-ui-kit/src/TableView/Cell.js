import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import styled from '../styled';

const asFirstChild = (child) =>
  cloneElement(child, {
    style: { paddingLeft: 0 },
  });

const Container = styled(
  ({ theme }) => ({
    paddingVertical: theme.sizing.baseUnit * 0.75,
    paddingHorizontal: theme.sizing.baseUnit,
    backgroundColor: theme.colors.background.paper,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    minHeight: theme.sizing.baseUnit * 2.5,
  }),
  'ui-kit.TableView.Cell.Container'
)(View);

const Cell = ({ children, ...otherProps }) => (
  <Container {...otherProps}>
    {Children.map(children, (child, i) => {
      if (i === 0) {
        return asFirstChild(child);
      }
      return child;
    })}
  </Container>
);

Cell.propTypes = {
  children: PropTypes.node,
};

export default Cell;
