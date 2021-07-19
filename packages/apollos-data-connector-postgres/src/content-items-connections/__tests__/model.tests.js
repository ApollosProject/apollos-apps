import { sequelize, sync } from '../../postgres/index';
import { createModel, setupModel } from '../model';
import * as ContentItem from '../../content-items/model';

describe('ContentItemsConnection model', () => {
  beforeEach(async () => {
    await ContentItem.createModel();
    await createModel();
    await setupModel();
    await sync();
  });
  afterEach(async () => {
    await sequelize.drop({ cascade: true });
  });

  it('constructs without issues', async () => {
    const parent = await sequelize.models.contentItem.create({
      title: 'Parent Item',
      originType: 'rock',
      originId: '1',
    });

    const child = await sequelize.models.contentItem.create({
      title: 'Child Item',
      originType: 'rock',
      originId: '2',
    });

    await child.addParent(parent, {
      through: {
        apollosType: 'ContentItemsConnect',
        originId: '1',
        originType: 'rock',
      },
    });

    await parent.reload();
    await child.reload();

    expect((await parent.getChildren())[0].id).toEqual(child.id);
    expect((await child.getParents())[0].id).toEqual(parent.id);
  });
});
