import CreateChurchTable001 from './001_create_church_table';
import RowLevelSecurity002 from './002_row_level_security';
import DefaultChurchIdToCurrentUser003 from './003_default_church_id_to_current_user';
import OriginIdChurchIdUniquenessConstraint004 from './004_origin_id_church_id_uniqueness_constraint';
import RenameChurchIdToChurchSlug005 from './005_rename_church_id_to_church_slug';
import AddRowLevelSecurityToChurchTable006 from './006_add_row_level_security_to_church_table';
import AddRowLevelSecurityToAuthenticationTables007 from './007_add_row_level_security_to_authentication_tables';

const migrations = [
  CreateChurchTable001,
  RowLevelSecurity002,
  DefaultChurchIdToCurrentUser003,
  OriginIdChurchIdUniquenessConstraint004,
  RenameChurchIdToChurchSlug005,
  AddRowLevelSecurityToChurchTable006,
  AddRowLevelSecurityToAuthenticationTables007,
];

export default migrations;
