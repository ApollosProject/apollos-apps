import React from 'react';

import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Query, Mutation } from 'react-apollo';

import Like from 'apolloschurchapp/src/ui/Like';
import { AnalyticsConsumer } from '@apollosproject/ui-analytics';

import getLikedContent from '../../tabs/connect/getLikedContent';
import updateLikeEntity from './updateLikeEntity';
import getLikedContentItem from './getLikedContentItem';
import updateLikedContent from './updateLikedContent';

const GetLikeData = ({ itemId, children }) => (
  <Query query={getLikedContentItem} variables={{ itemId }}>
    {({ data: { node = {} } = {}, loading }) => {
      const isLiked = loading ? false : get(node, 'isLiked') || false;
      return (
        // This preemptively loads getLikedContent into cache.
        // The only reason this is necessary is because we are reading this
        // particular query from cache in the updateLikedContent mutation.
        <Query query={getLikedContent} variables={{ first: 3 }}>
          {() => children({ isLiked, item: node })}
        </Query>
      );
    }}
  </Query>
);

GetLikeData.propTypes = {
  itemId: PropTypes.string,
  children: PropTypes.func.isRequired,
};

const UpdateLikeStatus = ({
  itemId,
  item = { __typename: null },
  isLiked,
  children,
}) => (
  <AnalyticsConsumer>
    {({ track }) => (
      <Mutation
        mutation={updateLikeEntity}
        optimisticResponse={{
          updateLikeEntity: {
            id: itemId, // unknown at this time
            isLiked: !isLiked,
            likedCount: 0, // field required but exact value is not needed
            __typename: item && item.__typename,
          },
        }}
        update={(
          cache,
          {
            data: {
              updateLikeEntity: { isLiked: liked },
            },
          }
        ) => {
          updateLikedContent({ liked, cache, item });
          cache.writeQuery({
            query: getLikedContentItem,
            data: {
              node: {
                ...item,
                isLiked: liked,
              },
            },
          });
        }}
      >
        {(createNewInteraction) =>
          itemId
            ? children({
                itemId,
                isLiked,
                toggleLike: async (variables) => {
                  try {
                    await createNewInteraction({ variables });
                    track({
                      eventName: isLiked ? 'UnlikeContent' : 'LikeContent',
                      properties: {
                        id: itemId,
                      },
                    });
                  } catch (e) {
                    throw e.message;
                  }
                },
              })
            : null
        }
      </Mutation>
    )}
  </AnalyticsConsumer>
);

UpdateLikeStatus.propTypes = {
  itemId: PropTypes.string,
  children: PropTypes.func.isRequired,
  isLiked: PropTypes.bool.isRequired,
  item: PropTypes.shape({
    id: PropTypes.string,
    __typename: PropTypes.string,
    isLiked: PropTypes.bool,
  }),
};

const LikeButton = ({ itemId }) => (
  <GetLikeData itemId={itemId}>
    {({ isLiked, item }) => (
      <UpdateLikeStatus itemId={itemId} item={item} isLiked={isLiked}>
        {({ toggleLike, isLiked: newLikeValue }) => (
          <Like
            itemId={itemId}
            isLiked={newLikeValue}
            toggleLike={toggleLike}
          />
        )}
      </UpdateLikeStatus>
    )}
  </GetLikeData>
);

LikeButton.propTypes = {
  itemId: PropTypes.string,
};

export default LikeButton;
