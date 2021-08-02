import { sequelize } from '../../postgres/index';
import * as ContentItem from '../../content-items';
import * as Feature from '../index';
import * as Media from '../../media';
import * as ContentItemCategory from '../../content-item-categories';

import { setupPostgresTestEnv } from '../../utils/testUtils';

describe('Features model', () => {
  beforeEach(async () => {
    await setupPostgresTestEnv([
      ContentItem,
      ContentItemCategory,
      Media,
      Feature,
    ]);
  });
  afterEach(async () => {
    await sequelize.drop({ cascade: true });
  });

  it('constructs without issues', async () => {
    const content = await sequelize.models.contentItem.create({
      title: 'Parent Item',
      originType: 'rock',
      originId: '1',
      parentType: 'ContentItem',
    });

    const featureData = { someData: 123, someOtherData: 'hello' };

    const feature = await sequelize.models.feature.create({
      type: 'ActionListFeature',
      data: featureData,
      originType: 'rock',
      originId: '2',
    });

    await content.addFeature(feature);

    expect((await content.getFeatures())[0].id).toEqual(feature.id);
    expect((await content.getFeatures())[0].data).toEqual(featureData);
  });
});
