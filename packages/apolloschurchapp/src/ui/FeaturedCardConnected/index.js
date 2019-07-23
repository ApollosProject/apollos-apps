import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { get } from 'lodash';

import { FeaturedCard, ErrorCard } from '@apollosproject/ui-kit';
import GET_CONTENT_CARD from './query';

const FeaturedCardConnected = ({ contentId, isLoading, ...otherProps }) => {
  if (!contentId || isLoading)
    return <FeaturedCard {...otherProps} isLoading />;

  return (
    <Query query={GET_CONTENT_CARD} variables={{ contentId }}>
      {({ data: { node = {} } = {}, loading, error }) => {
        if (error) return <ErrorCard error={error} />;

        const coverImage = get(node, 'coverImage.sources', undefined);

        return (
          <FeaturedCard
            {...node}
            {...otherProps}
            image={coverImage}
            title={node.title}
            description={node.summary}
            hasAction={node.videos && node.videos.length}
            isLiked={node.isLiked}
            isLive={node.liveStream && node.liveStream.isLive}
            labelText={node.parentChannel.name}
            theme={node.theme}
            isLoading={loading}
          />
        );
      }}
    </Query>
  );
};

FeaturedCardConnected.propTypes = {
  isLoading: PropTypes.bool,
  contentId: PropTypes.string,
};

export default FeaturedCardConnected;
