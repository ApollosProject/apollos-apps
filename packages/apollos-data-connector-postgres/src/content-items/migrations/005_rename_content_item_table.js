import { renameColumns, revertColumnNames } from '../../utils/renameColumns';

const fields = [
  'htmlContent',
  'publishAt',
  'originId',
  'originType',
  'apollosId',
  'apollosType',
  'createdAt',
  'updatedAt',
  'contentItemCategoryId',
  'coverImageId',
  'parentId',
];

async function up({ context: queryInterface }) {
  await queryInterface.renameTable('contentItems', 'content_item');

  await renameColumns({
    tableName: 'content_item',
    fields,
    queryInterface,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.renameTable('content_item', 'contentItems');

  await revertColumnNames({
    tableName: 'contentItems',
    fields,
    queryInterface,
  });
}

const name = '005-rename-content-item-table';

module.exports = { up, down, name, order: 8 };
