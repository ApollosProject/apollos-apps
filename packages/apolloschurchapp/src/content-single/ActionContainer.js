import React from 'react';
import { Query, Mutation } from 'react-apollo';

import PropTypes from 'prop-types';

import Share from 'apolloschurchapp/src/ui/Share';
import Like from 'apolloschurchapp/src/ui/Like';
import getSessionId from 'apolloschurchapp/src/auth/getSessionId';
import SideBySideView from 'apolloschurchapp/src/ui/SideBySideView';

import createInteraction from './createInteraction';
import getContentItem from './getContentItem';

const ActionContainer = ({ content, itemId }) => (
  <SideBySideView>
    <Query query={getSessionId} fetchPolicy="cache-only">
      {({ data: { sessionId } }) =>
        sessionId ? (
          <Query query={getContentItem} variables={{ itemId }}>
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
                    query: getContentItem,
                    data: { isLiked: operation === 'Like' },
                  });
                }}
              >
                {(createSession) => (
                  <Like
                    itemId={itemId}
                    sessionId={sessionId}
                    isLiked={isLiked}
                    operation={isLiked ? 'Unlike' : 'Like'}
                    toggleLike={async (variables) => {
                      try {
                        await createSession({ variables });
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
    <Share content={content} />
  </SideBySideView>
);

ActionContainer.propTypes = {
  content: PropTypes.shape({}),
  itemId: PropTypes.string,
};

export default ActionContainer;
