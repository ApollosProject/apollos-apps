const TYPES = [
  'ContentSeriesContentItem',
  'DevotionalContentItem',
  'MediaContentItem',
  'UniversalContentItem',
  'WeekendContentItem',
  'ContentItem',
];

const extendForEachContentItemType = (schema) =>
  [
    ...TYPES.filter((type) => type !== 'ContentItem').map(
      (type) => `extend type ${type} {
  ${schema}
}`
    ),
    `extend interface ContentItem {
  ${schema}
}`,
  ].join('\n');

const addInterfacesForEachContentItemType = (gqlInterfaces, types) =>
  types
    .flatMap((type) =>
      gqlInterfaces.map(
        (gqlInterface) => `extend type ${type} implements ${gqlInterface}`
      )
    )
    .join('\n');

export { extendForEachContentItemType, addInterfacesForEachContentItemType };
