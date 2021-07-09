import CreateTags001 from './001_create_tags';
import CreateJunctionTables002 from './002_create_tag_junction_tables';
import CreateTagsUniqueIndex003 from './003_create_tags_unique_index';

const migrations = [
  CreateTags001,
  CreateJunctionTables002,
  CreateTagsUniqueIndex003,
];

export default migrations;
