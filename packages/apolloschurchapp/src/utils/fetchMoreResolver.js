import get from 'lodash/get';
import set from 'lodash/fp/set';

export default function fetchMoreResolver({
  collectionName,
  after,
  variables,
  fetchMore,
} = {}) {
  return () => {
    if (!after) return;

    fetchMore({
      variables: { ...variables, after },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        // combine previous data and fetchMore data
        const newResult = set(
          collectionName,
          [
            ...(get(previousResult, collectionName) || []),
            ...(get(fetchMoreResult, collectionName) || []),
          ],
          { ...previousResult }
        );
        return newResult;
      },
    });
  };
}
