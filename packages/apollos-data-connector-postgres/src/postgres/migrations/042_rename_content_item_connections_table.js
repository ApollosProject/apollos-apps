import { renameColumns, revertColumnNames } from '../../utils/renameColumns';

const fields = [
  'childId',
  'parentId',
  'originId',
  'originType',
  'apollosId',
  'apollosType',
  'createdAt',
  'updatedAt',
];

async function up({ context: queryInterface }) {
  await queryInterface.renameTable(
    'contentItemsConnections',
    'content_item_connection'
  );

  await renameColumns({
    tableName: 'content_item_connection',
    fields,
    queryInterface,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.renameTable(
    'content_item_connection',
    'contentItemsConnections'
  );

  await revertColumnNames({
    tableName: 'contentItemsConnections',
    fields,
    queryInterface,
  });
}

const name = '003-rename-content-item-connections-table';

module.exports = { up, down, name };
