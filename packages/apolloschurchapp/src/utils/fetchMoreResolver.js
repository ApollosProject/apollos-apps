import get from 'lodash/get';
import set from 'lodash/fp/set';

export default function fetchMoreResolver({
  collectionName,
  pageInfo = { endCursor: null },
  variables,
  fetchMore,
} = {}) {
  return () => {
    if (!pageInfo.endCursor) return;

    fetchMore({
      variables: { ...variables, after: pageInfo.endCursor },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        // combine previous data and fetchMore data
        const newDataWithPageInfo = set(
          `${collectionName}.pageInfo`,
          {
            ...get(previousResult, `${collectionName}.pageInfo`, {}),
            ...get(fetchMoreResult, `${collectionName}.pageInfo`, {}),
          },
          previousResult
        );
        const newDataWithAdditionalItems = set(
          `${collectionName}.edges`,
          [
            ...get(previousResult, `${collectionName}.edges`, []),
            ...get(fetchMoreResult, `${collectionName}.edges`, []),
          ],
          newDataWithPageInfo
        );

        return newDataWithAdditionalItems;
      },
    });
  };
}
