import { renameColumns, revertColumnNames } from '../../utils/renameColumns';

const fields = [
  'originId',
  'originType',
  'apollosId',
  'apollosType',
  'createdAt',
  'updatedAt',
];

async function up({ context: queryInterface }) {
  await queryInterface.renameTable(
    'contentItemCategories',
    'content_item_category'
  );

  await renameColumns({
    tableName: 'content_item_category',
    fields,
    queryInterface,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.renameTable(
    'content_item_category',
    'contentItemCategories'
  );

  await revertColumnNames({
    tableName: 'contentItemCategories',
    fields,
    queryInterface,
  });
}

const name = '002-rename-content-item-categories-table';

module.exports = { up, down, name, order: 6 };
