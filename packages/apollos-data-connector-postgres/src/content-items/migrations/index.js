import CreateContentItems001 from './001_create_content_items';
import AddCoverImage002 from './002_add_cover_image';
import AddParent003 from './003_add_parent';
import UpdateContentItemForeignKeys from './004_update_content_item_foreign_keys';
import RenameContentItemTable from './005_rename_content_item_table';
import AddExpireAt from './006_add_expire_at';

const migrations = [
  CreateContentItems001,
  AddCoverImage002,
  AddParent003,
  UpdateContentItemForeignKeys,
  RenameContentItemTable,
  AddExpireAt,
];

export default migrations;
