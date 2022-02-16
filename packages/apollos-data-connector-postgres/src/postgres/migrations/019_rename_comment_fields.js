import { renameColumns, revertColumnNames } from '../../utils/renameColumns';

const fields = [
  'externalParentId',
  'externalParentType',
  'externalParentSource',
  'personId',
  'flagCount',
  'apollosId',
  'apollosType',
  'createdAt',
  'updatedAt',
  'likedCount',
];

async function up({ context: queryInterface }) {
  await queryInterface.renameTable('comments', 'comment');

  await renameColumns({
    tableName: 'comment',
    fields,
    queryInterface,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.renameTable('comment', 'comments');

  await revertColumnNames({
    tableName: 'comments',
    fields,
    queryInterface,
  });
}

const name = '003-rename-comment-fields';

module.exports = { up, down, name };
