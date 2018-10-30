import React from 'react';

import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Like from 'apolloschurchapp/src/ui/Like';
import { track, events } from 'apolloschurchapp/src/analytics';
import getAllLikedContent from 'apolloschurchapp/src/tabs/connect/getLikedContent';
import { contentItemFragment } from 'apolloschurchapp/src/content-single/getContentItem';

import updateLikeEntity from './updateLikeEntity';
import getLikedContentItem from './getLikedContentItem';

const GetLikeData = ({ itemId, children }) => (
  <Query query={getLikedContentItem} variables={{ itemId }}>
    {({ data: { node = {} } = {}, loading }) => {
      const isLiked = loading ? false : get(node, 'isLiked') || false;
      return children({ isLiked, item: node });
    }}
  </Query>
);

GetLikeData.propTypes = {
  itemId: PropTypes.string,
  children: PropTypes.func.isRequired,
};

const addItemToLikedContentList = ({ cache, item }) => {
  try {
    const data = cache.readQuery({ query: getAllLikedContent });
    const fullItem = cache.readFragment({
      id: `${item.__typename}:${item.id}`,
      fragmentName: 'LikedContentItemParts',
      fragment: gql`
        fragment LikedContentItemParts on ContentItem {
          ...contentItemFragment
          __typename
          id
          coverImage {
            name
            sources {
              uri
            }
          }
          isLiked
          parentChannel {
            id
            name
            iconName
          }
          title
        }
        ${contentItemFragment}
      `,
    });
    cache.writeQuery({
      query: getAllLikedContent,
      data: {
        ...data,
        getAllLikedContent: [fullItem, ...data.getAllLikedContent],
      },
    });
  } catch (e) {
    console.log(e);
    // Most likely we haven't ran the `getAllLikedContent` query yet.
    // We can safely exit.
  }
};

const removeItemFromLikedContentList = ({ cache, item }) => {
  try {
    const data = cache.readQuery({ query: getAllLikedContent });
    cache.writeQuery({
      query: getAllLikedContent,
      data: {
        ...data,
        getAllLikedContent: data.getAllLikedContent.filter(
          (content) => content.id !== item.id
        ),
      },
    });
  } catch (e) {
    console.log(e);
    // Most likely we haven't ran the `getAllLikedContent` query yet.
    // We can safely exit.
  }
};

const UpdateLikeStatus = ({ itemId, item, isLiked, children }) => (
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
      operation === 'Like'
        ? addItemToLikedContentList({ cache, item })
        : removeItemFromLikedContentList({ cache, item });
      cache.writeQuery({
        query: getLikedContentItem,
        data: {
          node: {
            ...item,
            isLiked: operation === 'Like',
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
                  eventName: isLiked
                    ? events.UnlikeContent
                    : events.LikeContent,
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
