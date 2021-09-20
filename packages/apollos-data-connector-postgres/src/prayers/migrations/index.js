import CreatePrayers001 from './001_create_prayers';
import RenamePrayerTable002 from './002_rename_prayer_table';
import CreatePersonPrayedForTable003 from './003_create_person_prayed_for_table';
import UpdatePersonPrayedForForeignKeyConstraints004 from './004_update_person_prayed_for_foreign_key_constraints';
import AddPrayerApprovedField005 from './005_add_prayer_approved_field';

const migrations = [
  CreatePrayers001,
  RenamePrayerTable002,
  CreatePersonPrayedForTable003,
  UpdatePersonPrayedForForeignKeyConstraints004,
  AddPrayerApprovedField005,
];

export default migrations;
