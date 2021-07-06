import { sequelize } from '../../postgres/index';
import { createModel, setupModel } from '../model';
import migrations from '../migrations';
import * as ContentItem from '../../content-items/model';
import ContentItemMigrations from '../../content-items/migrations';
import MediaMigrations from '../../media/migrations';
import createMigrationRunner from '../../postgres/performMigrations';

describe('Features model', () => {
  beforeEach(async () => {
    await ContentItem.createModel();
    await createModel();

    const migrationRunner = await createMigrationRunner({
      migrations: [...migrations, ...ContentItemMigrations, ...MediaMigrations],
    });
    await migrationRunner.up();

    await setupModel();
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

    const featureData = { someData: 123, someOtherData: 'hello' };

    const feature = await sequelize.models.feature.create({
      type: 'ActionListFeature',
      data: featureData,
      originType: 'rock',
      originId: '2',
    });

    await content.addFeature(feature);

    await content.reload();

    expect((await content.getFeatures())[0].id).toEqual(feature.id);
    expect((await content.getFeatures())[0].data).toEqual(featureData);
  });
});
