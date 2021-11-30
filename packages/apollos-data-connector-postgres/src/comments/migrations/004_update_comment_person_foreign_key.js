async function up({ context: queryInterface }) {
  await queryInterface.removeConstraint('comment', 'comments_personId_fkey');

  await queryInterface.addConstraint('comment', {
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
    'comment',
    'comment_person_id_people_fk'
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

const name = '004-update-comment-person-foreign_key';

module.exports = { up, down, name, order: 5 };
