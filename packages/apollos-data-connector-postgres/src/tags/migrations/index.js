import CreateTags001 from './001_create_tags';
import CreateJunctionTables002 from './002_create_tag_junction_tables';
import CreateTagsUniqueIndex003 from './003_create_tags_unique_index';
import UpdateTagForeignKeyConstraints004 from './004_update_tag_foreign_key_constraint';

const migrations = [
  CreateTags001,
  CreateJunctionTables002,
  CreateTagsUniqueIndex003,
  UpdateTagForeignKeyConstraints004,
];

export default migrations;
