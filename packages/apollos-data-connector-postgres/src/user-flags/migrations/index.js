import CreateUserFlags001 from './001_create_user_flags';
import AddPersonId002 from './002_add_person_id';
import RenameUserFlagFields003 from './003_rename_user_flag_fields';
import UpdatePeopleFlagForeignKey004 from './004_update_people_flag_foreign_key';

const migrations = [
  CreateUserFlags001,
  AddPersonId002,
  RenameUserFlagFields003,
  UpdatePeopleFlagForeignKey004,
];

export default migrations;
