async function up({ context: queryInterface }) {
  await queryInterface.removeConstraint(
    'user_flag',
    'user_flags_personId_fkey'
  );

  await queryInterface.addConstraint('user_flag', {
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
    'user_flag',
    'user_flag_person_id_people_fk'
  );

  await queryInterface.addConstraint('user_flag', {
    fields: ['person_id'],
    type: 'foreign key',
    references: {
      table: 'people',
      field: 'id',
    },
  });
}

const name = '006-update-people-flag-foreign-key';

module.exports = { up, down, name, order: 6 };
