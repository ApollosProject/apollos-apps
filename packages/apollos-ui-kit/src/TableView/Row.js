/**
 * Row.js
 *
 * Pre-configured Table Row for convenient rendering
 */

import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import { UIText } from '../typography';
import { withTheme } from '../theme';
import styled from '../styled';
import Icon from '../Icon';
import Cell from './Cell';
import CellText from './CellText';
import CellTextSmall from './CellTextSmall';
import CellContent from './CellContent';

const StyledIcon = withTheme(({ theme, iconProps = {} }) => ({
  fill: theme.colors.neutral.gray2,
  ...iconProps,
}))(Icon);

const AccessoryText = styled(({ theme }) => ({
  color: theme.colors.text.tertiary,
  size: 12,
  paddingHorizontal: theme.sizing.baseUnit * 0.5,
}))(UIText);

const Row = ({
  title,
  subtitle,
  accessoryText,
  leadingIcon,
  trailingIcon,
  leadingIconProps,
  trailingIconProps,
  accessoryComponent,
}) => {
  const hasTitle = title && !isEmpty(title);
  const hasSubtitle = subtitle && !isEmpty(subtitle);
  const hasAccessoryText = accessoryText && !isEmpty(accessoryText);

  /**
   * In order to avoid errors with the React Children Cloning, we need to return a React Fragment when there is no Icon to render
   * @param {string} name - Icon name
   * @param {Object} props - Icon props to pass to the component
   * @returns
   */
  function renderIcon(name, props) {
    if (name && !isEmpty(name)) return <StyledIcon name={name} {...props} />;

    return <></>;
  }

  return (
    <Cell>
      {renderIcon(leadingIcon, {
        size: 28,
        ...leadingIconProps,
      })}
      <CellContent>
        {hasTitle && <CellText>{title}</CellText>}
        {hasSubtitle && <CellTextSmall>{subtitle}</CellTextSmall>}
      </CellContent>
      {accessoryComponent}
      {hasAccessoryText && <AccessoryText>{accessoryText}</AccessoryText>}
      {renderIcon(trailingIcon, {
        size: 20,
        ...trailingIconProps,
      })}
    </Cell>
  );
};

Row.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  leadingIcon: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  leadingIconProps: PropTypes.shape({
    fill: PropTypes.string,
    size: PropTypes.number,
  }),
  trailingIcon: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  trailingIconProps: PropTypes.shape({
    fill: PropTypes.string,
    size: PropTypes.number,
  }),
  accessoryText: PropTypes.string,
  accessoryComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};
Row.defaultProps = {
  leadingIcon: false,
  leadingIconProps: {},
  trailingIcon: 'caret-right',
  trailingIconProps: {},
};

export default Row;
