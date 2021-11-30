async function up({ context: queryInterface }) {
  await queryInterface.removeConstraint(
    'interaction',
    'interaction_person_id_fkey'
  );

  await queryInterface.addConstraint('interaction', {
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
    'interaction',
    'interaction_person_id_people_fk'
  );

  await queryInterface.addConstraint('interaction', {
    fields: ['person_id'],
    type: 'foreign key',
    references: {
      table: 'people',
      field: 'id',
    },
  });
}

const name = '002-update-people-interaction-foreign_key';

module.exports = { up, down, name, order: 4 };
