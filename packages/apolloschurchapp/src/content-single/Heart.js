import React from 'react';

import PropTypes from 'prop-types';

import Like from 'apolloschurchapp/src/ui/Like';
import { Query, Mutation } from 'react-apollo';
import getSessionId from 'apolloschurchapp/src/store/getSessionId';
import createInteraction from './createInteraction';
import getLikedContentItem from './getLikedContentItem';

const Heart = ({ itemId }) => (
  <Query query={getSessionId} fetchPolicy="cache-only">
    {({ data: { sessionId } }) =>
      sessionId ? (
        <Query query={getLikedContentItem} variables={{ itemId }}>
          {({
            data: {
              node: { isLiked },
            },
            refetch,
          }) => (
            <Mutation
              mutation={createInteraction}
              update={(
                cache,
                {
                  data: {
                    createInteraction: { operation },
                  },
                }
              ) => {
                cache.writeQuery({
                  query: getLikedContentItem,
                  data: { isLiked: operation === 'Like' },
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
                      throw e;
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
