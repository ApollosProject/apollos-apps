import React, { memo } from 'react';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import { styled, ContentTableCard, H3, H6 } from '@apollosproject/ui-kit';

import GET_FEED_FEATURES from '../getFeedFeatures';

const StyledH6 = styled(({ theme }) => ({
  color: theme.colors.text.tertiary,
}))(H6);

const Features = memo(() => (
  <Query query={GET_FEED_FEATURES} fetchPolicy="cache-and-network">
    {({ data: features, loading: featuresLoading }) =>
      get(features, 'userFeedFeatures', []).map(
        ({ title, subtitle, actions, id }) => (
          <ContentTableCard
            isLoading={featuresLoading}
            onPress={this.handleOnPress}
            key={id}
            header={
              <>
                <StyledH6 isLoading={featuresLoading}>{title}</StyledH6>
                <H3
                  isLoading={featuresLoading}
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
                  {subtitle}
                </H3>
              </>
            }
            content={actions}
          />
        )
      )
    }
  </Query>
));

Features.displayName = 'Features';

export default Features;
