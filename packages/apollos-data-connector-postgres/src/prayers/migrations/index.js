import CreatePrayers001 from './001_create_prayers';
import RenamePrayerTable002 from './002_rename_prayer_table';
import CreatePersonPrayedForTable003 from './003_create_person_prayed_for_table';
import UpdatePersonPrayedForForeignKeyConstraints004 from './004_update_person_prayed_for_foreign_key_constraints';

const migrations = [
  CreatePrayers001,
  RenamePrayerTable002,
  CreatePersonPrayedForTable003,
  UpdatePersonPrayedForForeignKeyConstraints004,
];

export default migrations;
