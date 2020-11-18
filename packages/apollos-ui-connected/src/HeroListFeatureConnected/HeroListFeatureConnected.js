import React from 'react';
import { Query } from '@apollo/client/react/components';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import HeroListFeature from './HeroListFeature';
import GET_HERO_LIST_FEATURE from './getHeroListFeature';

function HeroListFeatureConnected({
  featureId,
  Component,
  isLoading,
  refetchRef,
  ...props
}) {
  return (
    <Query
      query={GET_HERO_LIST_FEATURE}
      variables={{ featureId }}
      fetchPolicy="cache-and-network"
    >
      {({ data, loading, refetch }) => {
        if (featureId && refetch && refetchRef)
          refetchRef({ refetch, id: featureId });
        return (
          <Component
            {...get(data, 'node')}
            {...props}
            isLoading={loading || isLoading}
          />
        );
      }}
    </Query>
  );
}

HeroListFeatureConnected.propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object,
  ]),
  featureId: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  refetchRef: PropTypes.func,
};

HeroListFeatureConnected.defaultProps = {
  Component: HeroListFeature,
};

export default HeroListFeatureConnected;
