import React from 'react';
import PropTypes from 'prop-types';

import { Card, Avatar } from '@apollosproject/ui-kit';

const PrayerCard = ({ avatar }) => (
  <Card>
    <Avatar source={avatar} size={'medium'} />
  </Card>
);

PrayerCard.propTypes = {
  avatar: PropTypes.shape({}),
};

export default PrayerCard;
