import React from 'react';

import PropTypes from 'prop-types';

import Like from 'apolloschurchapp/src/ui/Like';
import { Query, Mutation } from 'react-apollo';
import getSessionId from 'apolloschurchapp/src/store/getSessionId';
import updateLikeEntity from './updateLikeEntity';
import getLikedContentItem from './getLikedContentItem';

const Heart = ({ itemId }) => (
  <Query query={getSessionId} fetchPolicy="cache-only">
    {({ data: { sessionId } }) =>
      sessionId ? (
        <Query query={getLikedContentItem} variables={{ itemId }}>
          {({
            data: {
              node: { isLiked, ...node },
            },
            refetch,
          }) => (
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
                      ...node,
                      isLiked: operation === 'Like',
                    },
                  },
                });
              }}
            >
              {(createNewInteraction) => (
                <Like
                  itemId={itemId}
                  sessionId={sessionId}
                  isLiked={isLiked}
                  operation={isLiked ? 'Unlike' : 'Like'}
                  toggleLike={async (variables) => {
                    try {
                      await createNewInteraction({ variables });
                      await refetch();
                    } catch (e) {
                      console.log(e);
                    }
                  }}
                />
              )}
            </Mutation>
          )}
        </Query>
      ) : null
    }
  </Query>
);

Heart.propTypes = {
  itemId: PropTypes.string,
};

export default Heart;
