import React from 'react';

import PropTypes from 'prop-types';

import Like from 'apolloschurchapp/src/ui/Like';
import { Query, Mutation } from 'react-apollo';

const LikeButton = ({ itemId, updateLikeEntity, getLikedContentItem }) => (
  <Query query={getLikedContentItem} variables={{ itemId }}>
    {({ data, loading }) => {
      const isLiked = loading ? false : data.node.isLiked;
      return (
        <Mutation
          mutation={updateLikeEntity}
          optimisticResponse={{
            updateLikeEntity: {
              operation: isLiked ? 'Unlike' : 'Like',
              id: null, // unknown at this time
              interactionDateTime: new Date().toJSON(),
              __typename: 'Interaction',
            },
          }}
          update={(
            cache,
            {
              data: {
                updateLikeEntity: { operation },
              },
            }
          ) => {
            cache.writeQuery({
              query: getLikedContentItem,
              data: {
                node: {
                  ...data.node,
                  isLiked: operation === 'Like',
                },
              },
            });
          }}
        >
          {(createNewInteraction) => (
            <Like
              itemId={itemId}
              isLiked={isLiked}
              operation={isLiked ? 'Unlike' : 'Like'}
              toggleLike={async (variables) => {
                try {
                  await createNewInteraction({ variables });
                } catch (e) {
                  throw e.message;
                }
              }}
            />
          )}
        </Mutation>
      );
    }}
  </Query>
);

LikeButton.propTypes = {
  itemId: PropTypes.string,
  getLikedContentItem: PropTypes.shape({}),
  updateLikeEntity: PropTypes.shape({}),
};

export default LikeButton;
