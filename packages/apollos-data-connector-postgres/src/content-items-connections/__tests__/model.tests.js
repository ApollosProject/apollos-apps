import { sequelize } from '../../postgres/index';
import { setupPostgresTestEnv } from '../../utils/testUtils';
import * as ContentItem from '../../content-items';
import * as ContentItemCategory from '../../content-item-categories';
import * as ContentItemsConnection from '../index';
import * as Media from '../../media';

describe('ContentItemsConnection model', () => {
  beforeEach(async () => {
    await setupPostgresTestEnv([
      ContentItem,
      ContentItemCategory,
      ContentItemsConnection,
      Media,
    ]);
  });
  afterEach(async () => {
    await sequelize.drop({ cascade: true });
  });

  it('constructs without issues', async () => {
    const parent = await sequelize.models.contentItem.create({
      title: 'Parent Item',
      originType: 'rock',
      originId: '1',
      active: true,
    });

    const child = await sequelize.models.contentItem.create({
      title: 'Child Item',
      originType: 'rock',
      originId: '2',
      active: true,
    });

    await child.addParent(parent, {
      through: {
        apollosType: 'ContentItemsConnect',
        originId: '1',
        originType: 'rock',
      },
    });

    // const newParent = sequelize.models.contentItem.

    expect((await parent.getChildren())[0].id).toEqual(child.id);
    expect((await child.getParents())[0].id).toEqual(parent.id);
  });
});
