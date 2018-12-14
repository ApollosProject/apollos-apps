import ApollosConfig from '@apollosproject/config';
import { extendForEachContentItemType } from '../utils';

ApollosConfig.loadJs({
  ROCK_MAPPINGS: {
    CONTENT_ITEM: {
      ContentSeriesContentItem: {
        EntityType: 'ContentChannelItem',
      },
      ContentSomethingContentItem: {
        EntityType: 'ContentChannelItem',
      },
      ContentItem: {
        EntityType: 'ContentChannelItem',
      },
    },
  },
});

describe('extendForEachContentItemType', () => {
  it('should extend the interface and each specific content item', () => {
    const result = extendForEachContentItemType(` foo: Bar`);
    expect(result).toEqual(
      `extend type ContentSeriesContentItem {
   foo: Bar
}
extend type ContentSomethingContentItem {
   foo: Bar
}
extend interface ContentItem {
   foo: Bar
}`
    );
  });
});
