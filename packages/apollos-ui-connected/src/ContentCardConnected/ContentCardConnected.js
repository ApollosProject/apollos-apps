import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

import { ErrorCard, ContentCard } from '@apollosproject/ui-kit';

import { LiveConsumer } from '../live';

import GET_CONTENT_CARD from './getContentCard';

const ContentCardConnected = memo(
  ({ Component, contentId, isLoading, ...otherProps }) => {
    if (!contentId || isLoading) return <Component {...otherProps} isLoading />;

    return (
      <LiveConsumer contentId={contentId}>
        {(liveStream) => (
          <Query query={GET_CONTENT_CARD} variables={{ contentId }}>
            {({ data: { node = {} } = {}, loading, error }) => {
              if (error) return <ErrorCard error={error} />;
              return (
                <Component
                  {...node}
                  isLive={!!liveStream}
                  {...otherProps}
                  isLoading={loading}
                />
              );
            }}
          </Query>
        )}
      </LiveConsumer>
    );
  }
);

ContentCardConnected.propTypes = {
  Component: PropTypes.func,
  contentId: PropTypes.string,
  isLoading: PropTypes.bool,
};

ContentCardConnected.defaultProps = {
  Component: ContentCard,
};

ContentCardConnected.displayName = 'ContentCardConnected';

export default ContentCardConnected;
