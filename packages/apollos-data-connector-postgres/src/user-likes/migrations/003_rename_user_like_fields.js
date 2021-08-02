import { renameColumns, revertColumnNames } from '../../utils/renameColumns';

const fields = [
  'nodeId',
  'nodeType',
  'personId',
  'apollosId',
  'apollosType',
  'createdAt',
  'updatedAt',
];

async function up({ context: queryInterface }) {
  await queryInterface.renameTable('user_likes', 'user_like');
  await renameColumns({
    tableName: 'user_like',
    fields,
    queryInterface,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.renameTable('user_like', 'user_likes');
  await revertColumnNames({
    tableName: 'user_likes',
    fields,
    queryInterface,
  });
}

const name = '003-rename-user-like-fields';

module.exports = { up, down, name, order: 5 };
