import ApollosConfig from '@apollosproject/config';
import { sequelize } from '../../postgres/index';
import * as ContentItemModel from '../model';
import migrations from '../migrations';
import createMigrationRunner from '../../postgres/performMigrations';
import ContentItemDataSource from '../dataSource';
import { Media } from '../../index';

const context = {
  dataSources: {},
};

let contentItem1;
let ContentItem;

describe('Apollos Postgres ContentItem DataSource', () => {
  beforeEach(async () => {
    await ContentItemModel.createModel();
    await Media.models.createModel();

    const migrationRunner = await createMigrationRunner({
      migrations: [...migrations, Media.migrations],
    });
    await migrationRunner.up();

    await Media.models.setupModel();
    await ContentItemModel.setupModel();

    contentItem1 = await sequelize.models.contentItem.create({
      originId: '1',
      originType: 'rock',
      apollosType: 'UniversalContentItem',
      title: 'The First Content Item',
      active: true,
    });

    ContentItem = new ContentItemDataSource();
    ContentItem.initialize({ context });
  });
  afterEach(async () => {
    await sequelize.drop({});
  });

  it('fetches a ContentItem by id', async () => {
    const item = await ContentItem.getFromId(contentItem1.id);

    expect(item.id).toBe(contentItem1.id);

    const itemFromRock = await ContentItem.getFromId('1', null, {
      originType: 'rock',
    });

    expect(itemFromRock.id).toBe(contentItem1.id);
  });
});
