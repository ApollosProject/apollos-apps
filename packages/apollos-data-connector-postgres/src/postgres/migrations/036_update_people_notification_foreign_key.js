async function up({ context: queryInterface }) {
  await queryInterface.removeConstraint(
    'notification',
    'notifications_personId_fkey'
  );

  await queryInterface.addConstraint('notification', {
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
    'notification',
    'notification_person_id_people_fk'
  );

  await queryInterface.addConstraint('notification', {
    fields: ['person_id'],
    type: 'foreign key',
    references: {
      table: 'people',
      field: 'id',
    },
  });
}

const name = '003-update-people-notification-foreign_key';

module.exports = { up, down, name };
