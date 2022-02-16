async function up({ context: queryInterface }) {
  await queryInterface.removeConstraint(
    'prayer_request',
    'prayer_person_id_fkey'
  );

  await queryInterface.addConstraint('prayer_request', {
    fields: ['person_id'],
    type: 'foreign key',
    references: {
      table: 'people',
      field: 'id',
    },
    onDelete: 'cascade',
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.removeConstraint(
    'prayer_request',
    'prayer_request_person_id_people_fk'
  );

  await queryInterface.addConstraint('prayer_request', {
    fields: ['person_id'],
    type: 'foreign key',
    references: {
      table: 'people',
      field: 'id',
    },
  });
}

const name = '006-update-people-prayer-foreign-key';

module.exports = { up, down, name };
