import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { compose, renderComponent } from 'recompose';
import isEmpty from 'lodash/isEmpty';

import styled from '../styled';
import { enhancer as mediaQuery } from '../MediaQuery';
import Card from '../Card';
import HeaderText from './HeaderText';
import FooterText from './FooterText';

export { default as Cell } from './Cell';
export { default as CellText } from './CellText';
export { default as CellIcon } from './CellIcon';
export { default as Divider } from './Divider';
export { default as FormFields } from './FormFields';
export { default as CellContent } from './CellContent';
export { default as Row } from './Row';

const TableView = compose(
  styled(
    ({ theme, hasFooterText }) => ({
      marginBottom: hasFooterText ? 0 : theme.sizing.baseUnit,
      marginHorizontal: theme.sizing.baseUnit,
      backgroundColor: theme.colors.background.paper,
      borderLeftWidth: 0,
      borderRightWidth: 0,
      borderRadius: theme.sizing.baseBorderRadius,
      overflow: 'hidden',
    }),
    'ui-kit.TableView'
  ),
  mediaQuery(
    ({ md, width }, { responsive = true }) => responsive && width > md,
    renderComponent(Card)
  )
)(View);

TableView.proptypes = {
  responsive: PropTypes.bool,
};

const TableViewWithHeaders = ({ headerText, footerText, ...props }) => {
  const hasHeaderText = headerText && !isEmpty(headerText);
  const hasFooterText = footerText && !isEmpty(footerText);
  return (
    <>
      {hasHeaderText && <HeaderText>{headerText}</HeaderText>}
      <TableView {...props} hasFooterText={hasFooterText} />
      {hasFooterText && <FooterText>{footerText}</FooterText>}
    </>
  );
};

TableViewWithHeaders.propTypes = {
  headerText: PropTypes.string,
  footerText: PropTypes.string,
};

export default TableViewWithHeaders;
