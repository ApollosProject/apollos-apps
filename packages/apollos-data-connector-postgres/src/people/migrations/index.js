import CreatePeople001 from './001_create_people';
import ChangeProfileImageType002 from './002_change_profile_image_url_to_text';
import AddNamesIndex003 from './003_add_names_index';
import RenamePeopleFields004 from './004_rename_people_fields';
import AddPhoneToPerson005 from './005_add_phone_to_person';
import AllowNullOriginIdOriginType006 from './006_allow_null_origin_id_origin_type';

const migrations = [
  CreatePeople001,
  ChangeProfileImageType002,
  AddNamesIndex003,
  RenamePeopleFields004,
  AddPhoneToPerson005,
  AllowNullOriginIdOriginType006,
];

export default migrations;
