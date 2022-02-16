import { renameColumns, revertColumnNames } from '../../utils/renameColumns';

const fields = [
  'parentId',
  'parentType',
  'apollosId',
  'apollosType',
  'createdAt',
  'updatedAt',
];

async function up({ context: queryInterface }) {
  await queryInterface.renameTable('features', 'feature');

  await renameColumns({
    tableName: 'feature',
    fields,
    queryInterface,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.renameTable('feature', 'features');

  await revertColumnNames({
    tableName: 'features',
    fields,
    queryInterface,
  });
}

const name = '003-rename-feature-fields';

module.exports = { up, down, name };
