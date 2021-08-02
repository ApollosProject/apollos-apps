import CreateContentItemsConnection001 from './001_create_content_item_connections';
import UpdateForeignKeyConstraints002 from './002_update_foreign_key_constraints';
import RenameContentItemsConnectionsTable003 from './003_rename_content_item_connections_table';

const migrations = [
  CreateContentItemsConnection001,
  UpdateForeignKeyConstraints002,
  RenameContentItemsConnectionsTable003,
];

export default migrations;
