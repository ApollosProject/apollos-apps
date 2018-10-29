import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import ContentCard from '../ContentCard';
import { ErrorCard } from '../Card';

export const contentCardFragment = gql`
  fragment contentCardFragment on ContentItem {
    id
    title
    summary
    isLiked
    coverImage {
      sources {
        uri
      }
    }
    theme {
      type
      colors {
        primary
        secondary
        screen
        paper
      }
    }
    parentChannel {
      id
      name
    }
    videos {
      sources {
        uri
      }
    }
    audios {
      sources {
        uri
      }
    }
    isCollection
    isLiked
    likedCount
  }
`;

const getContentCard = gql`
  query getContentCard($contentId: ID!) {
    node(id: $contentId) {
      __typename
      ... on ContentItem {
        ...contentCardFragment
      }
    }
  }
  ${contentCardFragment}
`;

const ConnectedContentCard = ({
  contentId,
  isLoading,
  tile,
  ...otherProps
}) => {
  if (!contentId || isLoading) return <ContentCard {...otherProps} isLoading />;

  return (
    <Query query={getContentCard} variables={{ contentId }}>
      {({ data: { node = {} } = {}, loading, error }) => {
        if (error) return <ErrorCard error={error} />;

        const cardProps = {};

        // Always show image if available
        if (node.coverImage) cardProps.coverImage = node.coverImage.sources;

        // Attach title and summary
        if (!(tile && node.isCollection)) {
          cardProps.title = node.title;
          cardProps.summary = node.summary;
        }

        // Metrics, only liked for now
        cardProps.metrics = [
          {
            icon: node.isLiked ? 'like-solid' : 'like',
            value: node.likedCount,
          },
        ];

        return (
          <ContentCard
            {...cardProps}
            {...otherProps}
            tile={tile}
            isLoading={loading}
          />
        );
      }}
    </Query>
  );
};

ConnectedContentCard.propTypes = {
  isLoading: PropTypes.bool,
  contentId: PropTypes.string,
  tile: PropTypes.bool,
};

export default ConnectedContentCard;
