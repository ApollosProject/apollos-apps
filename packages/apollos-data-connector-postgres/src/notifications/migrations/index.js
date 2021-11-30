import CreateNotifications001 from './001_create_notifications';
import RenameNotificationFields002 from './002_rename_notification_fields';
import UpdatePeopleNotificationForeignKey003 from './003_update_people_notification_foreign_key';

const migrations = [
  CreateNotifications001,
  RenameNotificationFields002,
  UpdatePeopleNotificationForeignKey003,
];

export default migrations;
