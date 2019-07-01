import React from 'react';
import PropTypes from 'prop-types';
import Card, { CardContent, CardActions } from '../Card';
import ChannelLabel from '../ChannelLabel';
import styled from '../styled';
import { withTheme } from '../theme';

const ActionCardActions = styled(
  {
    justifyContent: 'flex-end',
  },
  'ActionCard.Actions'
)(CardActions);

const StyledChannelLabel = withTheme(({ theme }) => ({
  tint: theme.colors.primary,
  style: { paddingBottom: theme.sizing.baseUnit },
}))(ChannelLabel);

const ActionCard = ({ label, icon, children, action, ...otherProps }) => (
  <Card {...otherProps}>
    <CardContent>
      {label && icon ? <StyledChannelLabel label={label} icon={icon} /> : null}
      {children}
    </CardContent>
    {action ? <ActionCardActions>{action}</ActionCardActions> : null}
  </Card>
);

ActionCard.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.string,
  children: PropTypes.any, // eslint-disable-line
  action: PropTypes.node,
};

export default ActionCard;
