async function up({ context: queryInterface }) {
  await queryInterface.removeConstraint(
    'follow',
    'follows_requestPersonId_fkey'
  );

  await queryInterface.removeConstraint(
    'follow',
    'follows_followedPersonId_fkey'
  );

  await queryInterface.addConstraint('follow', {
    fields: ['request_person_id'],
    type: 'foreign key',
    references: {
      table: 'people',
      field: 'id',
    },
    onDelete: 'cascade',
  });

  await queryInterface.addConstraint('follow', {
    fields: ['followed_person_id'],
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
    'follow',
    'follow_request_person_id_people_fk'
  );

  await queryInterface.removeConstraint(
    'follow',
    'follow_followed_person_id_people_fk'
  );

  await queryInterface.addConstraint('follow', {
    fields: ['request_person_id'],
    type: 'foreign key',
    references: {
      table: 'people',
      field: 'id',
    },
  });

  await queryInterface.addConstraint('follow', {
    fields: ['followed_person_id'],
    type: 'foreign key',
    references: {
      table: 'people',
      field: 'id',
    },
  });
}

const name = '003-follow-people-foreign-key';

module.exports = { up, down, name };
