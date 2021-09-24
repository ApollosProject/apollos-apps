import CreateNotificationPreferences001 from './001_create_notification_preferences';
import RenameNotificationPreferences002 from './002_rename_notification_preference_fields';
import UpdateNotificationPreferencesForeignKeyConstraint from './003_update_notification_preferences_foreign_key_constraint';

const migrations = [
  CreateNotificationPreferences001,
  RenameNotificationPreferences002,
  UpdateNotificationPreferencesForeignKeyConstraint,
];

export default migrations;
