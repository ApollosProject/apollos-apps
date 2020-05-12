import React from 'react';
import PropTypes from 'prop-types';

import { BodyText, H4 } from '@apollosproject/ui-kit';

const PrayerContent = ({ prayer, title }) => (
  <>
    <H4 padded>{title}</H4>
    <BodyText>{prayer}</BodyText>
  </>
);

PrayerContent.propTypes = {
  title: PropTypes.string,
  prayer: PropTypes.string,
};

export default PrayerContent;
