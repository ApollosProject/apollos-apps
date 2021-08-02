import { renameColumns, revertColumnNames } from '../../utils/renameColumns';

const fields = [
  'sentAt',
  'scheduledAt',
  'notificationType',
  'deliveryMethod',
  'personId',
  'externalNotificationId',
  'apollosId',
  'apollosType',
  'createdAt',
  'updatedAt',
];

async function up({ context: queryInterface }) {
  await queryInterface.renameTable('notifications', 'notification');

  await renameColumns({
    tableName: 'notification',
    fields,
    queryInterface,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.renameTable('campus', 'notifications');

  await revertColumnNames({
    tableName: 'notifications',
    fields,
    queryInterface,
  });
}

const name = '002-rename-notification-fields';

module.exports = { up, down, name, order: 4 };
