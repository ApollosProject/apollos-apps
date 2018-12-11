/* eslint-disable import/prefer-default-export */
import ApollosConfig from '@apollosproject/config';

const { ROCK_MAPPINGS = { CONTENT_ITEM: {} } } = ApollosConfig;

const extendForEachContentItemType = (schema) =>
  [
    ...Object.keys(ROCK_MAPPINGS.CONTENT_ITEM)
      .filter((type) => type !== 'ContentItem')
      .map(
        (type) => `extend type ${type} {
  ${schema}
}`
      ),
    `extend interface ContentItem {
  ${schema}
}`,
  ].join('\n');

export { extendForEachContentItemType };
