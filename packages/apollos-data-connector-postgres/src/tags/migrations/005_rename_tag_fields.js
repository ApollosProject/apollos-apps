import { renameColumns, revertColumnNames } from '../../utils/renameColumns';

const tagFields = [
  'originId',
  'originType',
  'apollosId',
  'apollosType',
  'createdAt',
  'updatedAt',
];

const contentTagFields = ['tagId', 'contentItemId', 'createdAt', 'updatedAt'];

const peopleTagFields = ['tagId', 'personId', 'createdAt', 'updatedAt'];

async function up({ context: queryInterface }) {
  await queryInterface.renameTable('tags', 'tag');
  await renameColumns({
    tableName: 'tag',
    fields: tagFields,
    queryInterface,
  });
  await renameColumns({
    tableName: 'content_tag',
    fields: contentTagFields,
    queryInterface,
  });
  await renameColumns({
    tableName: 'people_tag',
    fields: peopleTagFields,
    queryInterface,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.renameTable('tag', 'tags');
  await revertColumnNames({
    tableName: 'tags',
    fields: tagFields,
    queryInterface,
  });
  await revertColumnNames({
    tableName: 'content_tag',
    fields: contentTagFields,
    queryInterface,
  });
  await revertColumnNames({
    tableName: 'people_tag',
    fields: peopleTagFields,
    queryInterface,
  });
}

const name = '005-rename-tag-fields';

module.exports = { up, down, name, order: 7 };
