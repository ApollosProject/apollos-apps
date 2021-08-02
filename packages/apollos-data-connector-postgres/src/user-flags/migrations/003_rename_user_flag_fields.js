import { renameColumns, revertColumnNames } from '../../utils/renameColumns';

const fields = [
  'nodeId',
  'nodeType',
  'externalPersonId',
  'apollosId',
  'apollosType',
  'createdAt',
  'updatedAt',
  'personId',
];

async function up({ context: queryInterface }) {
  await queryInterface.renameTable('user_flags', 'user_flag');
  await renameColumns({
    tableName: 'user_flag',
    fields,
    queryInterface,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.renameTable('user_flag', 'user_flags');
  await revertColumnNames({
    tableName: 'user_flags',
    fields,
    queryInterface,
  });
}

const name = '003-rename-user-flag-fields';

module.exports = { up, down, name, order: 5 };
