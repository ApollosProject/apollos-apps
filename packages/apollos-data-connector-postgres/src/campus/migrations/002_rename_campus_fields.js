import { renameColumns, revertColumnNames } from '../../utils/renameColumns';

const fields = [
  'postalCode',
  'imageUrl',
  'originId',
  'originType',
  'apollosId',
  'apollosType',
  'createdAt',
  'updatedAt',
];

async function up({ context: queryInterface }) {
  await queryInterface.renameTable('campuses', 'campus');

  await renameColumns({
    tableName: 'campus',
    fields,
    queryInterface,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.renameTable('campus', 'campuses');

  await revertColumnNames({
    tableName: 'campuses',
    fields,
    queryInterface,
  });
}

const name = '002-rename-campus-fields';

module.exports = { up, down, name, order: 4 };
