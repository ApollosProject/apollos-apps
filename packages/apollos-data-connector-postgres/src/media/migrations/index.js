import CreateMedia001 from './001_create_media';
import UpdateMediaPrimaryKeys002 from './002_update_media_primary_keys';
import AddIdToMedia003 from './003_add_id_to_media';
import AddMetadataColumn004 from './004_add_metadata_column';
import ChangeUrlToText005 from './005_change_url_to_text';
import RenameMediaFields005 from './005_rename_media_fields';

const migrations = [
  CreateMedia001,
  UpdateMediaPrimaryKeys002,
  AddIdToMedia003,
  AddMetadataColumn004,
  ChangeUrlToText005,
  RenameMediaFields005,
];

export default migrations;
