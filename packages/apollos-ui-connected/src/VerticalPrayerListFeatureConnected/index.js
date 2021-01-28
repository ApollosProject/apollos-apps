import React from 'react';
import PropTypes from 'prop-types';

import { useQuery } from '@apollo/client';
import VerticalPrayerListFeature from './VerticalPrayerListFeature';
import GET_VERTICAL_PRAYER_LIST_FEATURE from './getVerticalPrayerListFeature';

const VerticalPrayerListFeatureConnected = ({ featureId }) => {
  const { loading, error, data } = useQuery(GET_VERTICAL_PRAYER_LIST_FEATURE, {
    fetchPolicy: 'cache-and-network',
    variables: { featureId },
  });
  if (error || loading) return null;
  const { node: { title, subtitle, prayers } = {} } = data;
  return (
    <VerticalPrayerListFeature
      title={title}
      subtitle={subtitle}
      prayers={prayers}
    />
  );
};

VerticalPrayerListFeatureConnected.propTypes = {
  featureId: PropTypes.string,
};

export default VerticalPrayerListFeatureConnected;
