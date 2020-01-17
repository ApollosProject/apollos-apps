import ApollosConfig from '@apollosproject/config';
import { GET_LIKED_CONTENT } from '../LikedContentFeedConnected';

const addItemToLikedContentFeed = ({ cache, item, variables }) => {
  try {
    const data = cache.readQuery({
      query: GET_LIKED_CONTENT,
      variables,
    });
    const fullItem = cache.readFragment({
      id: `${item.__typename}:${item.id}`,
      fragment: ApollosConfig.FRAGMENTS.CONTENT_CARD_FRAGMENT,
      fragmentName: 'contentCardFragment',
    });
    const newEdges = [
      fullItem,
      ...data.likedContent.edges.map(({ node }) => node),
    ].map((node) => ({
      __typename: 'ContentItemsConnectionEdge',
      node: {
        ...node,
        isLiked: true,
      },
    }));
    cache.writeQuery({
      query: GET_LIKED_CONTENT,
      variables,
      data: {
        ...data,
        likedContent: {
          ...data.likedContent,
          edges: newEdges,
        },
      },
    });
  } catch (e) {
    console.log(e);
    // Most likely we haven't ran the `GET_LIKED_CONTENT` query yet.
    // We can safely exit.
  }
};

const removeItemFromLikedContentFeed = ({ cache, item, variables }) => {
  try {
    const data = cache.readQuery({
      query: GET_LIKED_CONTENT,
      variables,
    });

    const filteredEdges = data.likedContent.edges.filter(
      ({ node }) => node.id !== item.id
    );

    cache.writeQuery({
      query: GET_LIKED_CONTENT,
      variables,
      data: {
        ...data,
        likedContent: {
          ...data.likedContent,
          edges: filteredEdges,
        },
      },
    });
  } catch (e) {
    console.log(e);
    // Most likely we haven't ran the `GET_LIKED_CONTENT` query yet.
    // We can safely exit.
  }
};

const updateLikedContent = ({ liked, cache, item }) => {
  if (liked) {
    addItemToLikedContentFeed({ cache, item, variables: { first: 3 } });
    addItemToLikedContentFeed({ cache, item, variables: { first: 20 } });
  } else {
    removeItemFromLikedContentFeed({ cache, item, variables: { first: 3 } });
    removeItemFromLikedContentFeed({ cache, item, variables: { first: 20 } });
  }
};

export default updateLikedContent;
