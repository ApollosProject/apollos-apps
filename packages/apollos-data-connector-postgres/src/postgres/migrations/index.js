import AddUUID from './000_add_uuid_extension';
import AddPGTRGM from './001_add_pg_trgm_extension';

const migrations = [AddUUID, AddPGTRGM];

export default migrations;
