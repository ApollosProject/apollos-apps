async function up({ context: queryInterface }) {
  await queryInterface.removeConstraint(
    'contentItemsConnections',
    'contentItemsConnections_childId_fkey'
  );

  await queryInterface.removeConstraint(
    'contentItemsConnections',
    'contentItemsConnections_parentId_fkey'
  );

  await queryInterface.addConstraint('contentItemsConnections', {
    fields: ['childId'],
    type: 'foreign key',
    references: {
      table: 'contentItems',
      field: 'id',
    },
    onDelete: 'cascade',
  });
  await queryInterface.addConstraint('contentItemsConnections', {
    fields: ['parentId'],
    type: 'foreign key',
    references: {
      table: 'contentItems',
      field: 'id',
    },
    onDelete: 'cascade',
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.removeConstraint(
    'contentItemsConnections',
    'contentItemsConnections_childId_contentItems_fk'
  );

  await queryInterface.removeConstraint(
    'contentItemsConnections',
    'contentItemsConnections_parentId_contentItems_fk'
  );
}

const name = '002_update_foreign_key_constraints';

module.exports = { up, down, name, order: 5 };
