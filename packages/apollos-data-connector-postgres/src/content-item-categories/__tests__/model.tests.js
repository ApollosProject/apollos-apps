import { sequelize, sync } from '../../postgres/index';
import { createModel, setupModel } from '../model';
import * as ContentItem from '../../content-items/model';

describe('ContentItemCategory model', () => {
  beforeEach(async () => {
    await ContentItem.createModel();
    await createModel();
    await setupModel();
    await sync();
  });
  afterEach(async () => {
    await sequelize.dropAllSchemas();
  });

  it('constructs without issues', async () => {
    const content = await sequelize.models.contentItem.create({
      title: 'Parent Item',
      originType: 'rock',
      originId: '1',
    });

    const category = await sequelize.models.contentItemCategory.create({
      title: 'Devotionals',
      originType: 'rock',
      originId: '2',
    });

    await content.setContentItemCategory(category);

    await content.reload();

    expect((await content.getContentItemCategory()).id).toEqual(category.id);
  });
});
