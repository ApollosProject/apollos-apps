async function up({ context: queryInterface }) {
  await queryInterface.addConstraint('person_prayed_for', {
    fields: ['person_id'],
    type: 'foreign key',
    references: {
      table: 'people',
      field: 'id',
    },
    onDelete: 'cascade',
  });

  // Deleting tag will delete the content_tag
  await queryInterface.addConstraint('person_prayed_for', {
    fields: ['prayer_request_id'],
    type: 'foreign key',
    references: {
      table: 'prayer_request',
      field: 'id',
    },
    onDelete: 'cascade',
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('person_prayed_for');
}

const name = '004-update-person-prayed-for-foreign-key-constraints';

module.exports = { up, down, name, order: 6 };
