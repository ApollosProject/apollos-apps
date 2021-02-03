import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';

import { useQuery } from '@apollo/client';
import VerticalPrayerListFeature from './VerticalPrayerListFeature';
import GET_VERTICAL_PRAYER_LIST_FEATURE from './getVerticalPrayerListFeature';

const VerticalPrayerListFeatureConnected = ({ featureId, refetchRef }) => {
  const { loading, error, data, refetch } = useQuery(
    GET_VERTICAL_PRAYER_LIST_FEATURE,
    {
      fetchPolicy: 'cache-and-network',
      variables: { featureId },
    }
  );
  if (error || loading) return <Text>hello</Text>;
  if (featureId && refetch && refetchRef)
    refetchRef({ refetch, id: featureId });
  return (
    <VerticalPrayerListFeature
      title={data?.node?.title ?? ''}
      subtitle={data?.node?.subtitle ?? ''}
      prayers={data?.node?.prayers ?? []}
    />
  );
};

VerticalPrayerListFeatureConnected.propTypes = {
  featureId: PropTypes.string,
  refetchRef: PropTypes.func,
};

export default VerticalPrayerListFeatureConnected;
