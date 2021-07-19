import CreateContentItems001 from './001_create_content_items';
import AddCoverImage002 from './002_add_cover_image';
import AddParent003 from './003_add_parent';
import UpdateContentItemForeignKeys from './004_update_content_item_foreign_keys';

const migrations = [
  CreateContentItems001,
  AddCoverImage002,
  AddParent003,
  UpdateContentItemForeignKeys,
];

export default migrations;
