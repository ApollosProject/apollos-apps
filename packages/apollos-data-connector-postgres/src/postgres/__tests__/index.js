import { DataTypes } from 'sequelize';
import { getSequelize, defineModel, configureModel } from '../index';

const context = {
  church: { slug: 'apollos_demo' },
};

describe('Apollos Postgres support', () => {
  let sequelize;
  let globalSequelize;
  beforeEach(() => {
    sequelize = getSequelize({ churchSlug: 'apollos_demo' });
    globalSequelize = getSequelize({ churchSlug: 'global' });
  });
  afterEach(async () => {
    await sequelize.drop({ cascade: true });
    await globalSequelize.drop({ cascade: true });
  });

  it('should support defining new models', async () => {
    const makeContentItem = defineModel({
      modelName: 'content_item',
      attributes: {
        title: DataTypes.STRING,
      },
      resolveType: () => 'ContentItem',
    });
    makeContentItem(context);

    await sequelize.sync();

    const fakeContentItem = await sequelize.models.content_item.create({
      title: 'A content item title',
    });

    expect(fakeContentItem.title).toBe('A content item title');
    expect(fakeContentItem.apollosType).toBe('ContentItem');
    expect(fakeContentItem.apollosId).toBe(`ContentItem:${fakeContentItem.id}`);
  });
  it('should support defining new external models', async () => {
    const makeContentItem = defineModel({
      modelName: 'content_item',
      attributes: {
        title: DataTypes.STRING,
      },
      resolveType: () => 'ContentItem',
      external: true,
    });

    makeContentItem(context);

    await sequelize.sync();

    const fakeContentItem = await sequelize.models.content_item.create({
      title: 'A content item title',
      originType: 'rock',
      originId: '1',
    });

    expect(fakeContentItem.title).toBe('A content item title');
    expect(fakeContentItem.originId).toBe('1');
    expect(fakeContentItem.originType).toBe('rock');
  });

  it('should support defining relationships', async () => {
    const makeContentItem = defineModel({
      modelName: 'content_item',
      attributes: {
        title: DataTypes.STRING,
      },
      resolveType: () => 'ContentItem',
      external: true,
    });

    const makeScriptureJournal = defineModel({
      modelName: 'journal',
      attributes: {
        journal: DataTypes.STRING,
        verse: DataTypes.STRING,
      },
      resolveType: () => 'ScriptureJournal',
    });

    // In practice, this would happen in either the scripture or ContentItem model file.
    const makeRelationships = configureModel(({ sequelize: { models } }) => {
      models.journal.belongsTo(models.content_item);
      models.content_item.hasMany(models.journal);
    });

    makeContentItem(context);
    makeScriptureJournal(context);

    makeRelationships(context);

    await sequelize.sync();

    const fakeContentItem = await sequelize.models.content_item.create({
      title: 'A content item title',
      originType: 'rock',
      originId: '1',
    });

    const fakeJournal = await sequelize.models.journal.create({
      journal: 'Some journal content',
    });

    await fakeContentItem.addJournal(fakeJournal);

    expect(await fakeContentItem.getJournals()).toContainEqual(
      await fakeJournal.reload()
    );
  });
});
