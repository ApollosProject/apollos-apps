import React from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import styled from '../styled';
import { ThemeMixin } from '../theme';
import Chip from '../Chip';
import Icon from '../Icon';

const StyledChip = styled(
  ({ type }) => ({
    /* when the overlay type is transparent the borders look funny. TODO: Button refactor - consider
     * moving this change to `Chip` or `Button` */
    ...(type === 'overlay' ? { borderWidth: 0 } : {}),
  }),
  'ui-kit.CardLabel'
)(Chip);

const Label = ({ title, icon, type, theme, ...props }) => (
  <ThemeMixin
    mixin={{
      type: get(theme, 'type', 'light').toLowerCase(), // not sure why we need toLowerCase
      colors: get(theme, 'colors', {}),
    }}
  >
    <StyledChip title={title} icon={icon} type={type} {...props} />
  </ThemeMixin>
);

Label.propTypes = {
  title: PropTypes.string.isRequired,
  icon: Icon.propTypes.name,
  theme: PropTypes.shape({
    type: PropTypes.string,
    colors: PropTypes.shape({}),
  }),
  type: PropTypes.string,
  ...Chip.propTypes,
};

Label.defaultProps = {
  type: 'overlay',
};

Label.displayName = 'CardLabel';

export default Label;
