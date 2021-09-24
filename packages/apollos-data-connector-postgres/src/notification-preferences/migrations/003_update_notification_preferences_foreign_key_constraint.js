async function up({ context: queryInterface }) {
  await queryInterface.removeConstraint(
    'notification_preference',
    'notificationPreferences_personId_fkey'
  );
  // Deleting people will delete corresponding notification preferences
  await queryInterface.addConstraint('notification_preference', {
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
    'notification_preference',
    'notification_preference_person_id_people_fk'
  );

  await queryInterface.addConstraint('notification_preference', {
    fields: ['person_id'],
    type: 'foreign key',
    references: {
      table: 'people',
      field: 'id',
    },
  });
}

const name = '003_update_notification_preferences_foreign_key_constraint';

module.exports = { up, down, name, order: 5 };
