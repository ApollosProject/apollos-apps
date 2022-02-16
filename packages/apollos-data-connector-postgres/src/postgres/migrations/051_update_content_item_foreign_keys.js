async function up({ context: queryInterface }) {
  await queryInterface.removeConstraint(
    'contentItems',
    'contentItems_parentId_fkey'
  );

  await queryInterface.removeConstraint(
    'contentItems',
    'contentItems_coverImageId_fkey'
  );
  await queryInterface.addConstraint('contentItems', {
    fields: ['parentId'],
    type: 'foreign key',
    references: {
      table: 'contentItems',
      field: 'id',
    },
    onDelete: 'set null',
  });
  await queryInterface.addConstraint('contentItems', {
    fields: ['coverImageId'],
    type: 'foreign key',
    references: {
      table: 'media',
      field: 'id',
    },
    onDelete: 'set null',
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.removeConstraint(
    'contentItems',
    'contentItems_coverImageId_media_fk'
  );

  await queryInterface.removeConstraint(
    'contentItems',
    'contentItems_parentId_contentItems_fk'
  );
}

const name = '004-update-content-item-foreign-keys';

module.exports = { up, down, name };
