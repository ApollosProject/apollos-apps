import get from 'lodash/get';
import set from 'lodash/fp/set';

/**
 * Builds an Apollo `updateQuery` function that appends the `edges` (and
 * merges `pageInfo`, when present) returned by `fetchMore` onto the edges
 * already in the cache for a given connection field, e.g.
 * `node.childContentItemsConnection`.
 *
 * `collectionName` may also be a function of the query result (called with
 * `previousResult`) for cases where the field to merge can only be
 * determined once data is available (e.g. picking between a "parent" and
 * "sibling" connection based on the shape of the result).
 */
export function buildFetchMoreUpdateQuery(collectionName) {
  return (previousResult, { fetchMoreResult }) => {
    const resolvedCollectionName =
      typeof collectionName === 'function'
        ? collectionName(previousResult)
        : collectionName;

    const pageInfoPath = `${resolvedCollectionName}.pageInfo`;
    const edgePath = `${resolvedCollectionName}.edges`;

    // combine previous data and fetchMore data
    const newDataWithPageInfo = set(
      pageInfoPath,
      {
        ...get(previousResult, pageInfoPath, {}),
        ...get(fetchMoreResult, pageInfoPath, {}),
      },
      previousResult
    );
    const newDataWithAdditionalItems = set(
      edgePath,
      [
        ...get(previousResult, edgePath, []),
        ...get(fetchMoreResult, edgePath, []),
      ],
      newDataWithPageInfo
    );

    return newDataWithAdditionalItems;
  };
}

export default function fetchMoreResolver({
  collectionName,
  variables,
  fetchMore,
  data,
}) {
  return () => {
    const pageInfoPath = `${collectionName}.pageInfo`;

    const after = get(data, `${pageInfoPath}.endCursor`);
    if (!after) {
      return;
    }

    fetchMore({
      variables: { ...variables, after },
      updateQuery: buildFetchMoreUpdateQuery(collectionName),
    });
  };
}
