import getAllLikedContent from 'apolloschurchapp/src/tabs/connect/getLikedContent';
import { contentItemFragment } from 'apolloschurchapp/src/content-single/getContentItem';

const addItemToLikedContentList = ({ cache, item, variables }) => {
  try {
    const data = cache.readQuery({
      query: getAllLikedContent,
      variables,
    });
    const fullItem = cache.readFragment({
      id: `${item.__typename}:${item.id}`,
      fragment: contentItemFragment,
    });
    const newEdges = [
      fullItem,
      ...data.getAllLikedContent.edges.map(({ node }) => node),
    ].map((node) => ({
      __typename: 'ContentItemsConnectionEdge',
      node,
    }));
    cache.writeQuery({
      query: getAllLikedContent,
      variables,
      data: {
        ...data,
        getAllLikedContent: {
          ...data.getAllLikedContent,
          edges: newEdges,
        },
      },
    });
  } catch (e) {
    console.log(e);
    // Most likely we haven't ran the `getAllLikedContent` query yet.
    // We can safely exit.
  }
};

const removeItemFromLikedContentList = ({ cache, item, variables }) => {
  try {
    const data = cache.readQuery({
      query: getAllLikedContent,
      variables,
    });

    const filteredEdges = data.getAllLikedContent.edges.filter(
      ({ node }) => node.id !== item.id
    );

    cache.writeQuery({
      query: getAllLikedContent,
      variables,
      data: {
        ...data,
        getAllLikedContent: {
          ...data.getAllLikedContent,
          edges: filteredEdges,
        },
      },
    });
  } catch (e) {
    console.log(e);
    // Most likely we haven't ran the `getAllLikedContent` query yet.
    // We can safely exit.
  }
};

const updateLikedContent = ({ liked, cache, item }) => {
  if (liked) {
    addItemToLikedContentList({ cache, item, variables: { first: 3 } });
    addItemToLikedContentList({ cache, item, variables: { first: 20 } });
  } else {
    removeItemFromLikedContentList({ cache, item, variables: { first: 3 } });
    removeItemFromLikedContentList({ cache, item, variables: { first: 20 } });
  }
};

export default updateLikedContent;
