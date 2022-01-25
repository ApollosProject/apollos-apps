import { Sequelize } from 'sequelize';

const NEW_ENUM_VALUE = 'LINK_CODE';

async function up({ context: queryInterface }) {
  return queryInterface.sequelize.query(`ALTER TYPE "enum_otp_type" ADD VALUE '${NEW_ENUM_VALUE}'`);
}

async function down({ context: queryInterface }) {
  return queryInterface.sequelize.query(`
    DELETE 
    FROM
      pg_enum
    WHERE
      enumlabel = '${NEW_ENUM_VALUE}' AND
      enumtypid = (
        SELECT
          oid
        FROM
          pg_type
        WHERE
          typname = 'enum_otp_type'
      )
  `);    
}

const name = '002_add_otp_type_enum_value_link_code';

module.exports = { up, down, name, order: 4 };
