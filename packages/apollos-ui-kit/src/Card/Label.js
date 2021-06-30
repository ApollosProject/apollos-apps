import React from 'react';
import PropTypes from 'prop-types';

import ChannelLabel from '../ChannelLabel';

const Label = ({ title, icon, IconComponent }) => (
  <ChannelLabel label={title} icon={icon} IconComponent={IconComponent} />
);

Label.propTypes = {
  title: PropTypes.string,
  IconComponent: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.element,
  ]),
  icon: PropTypes.string,
};

Label.displayName = 'CardLabel';

export default Label;
