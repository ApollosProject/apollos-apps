import { Sequelize } from 'sequelize';

async function up({ context: queryInterface }) {
  /*
  Adds support for a new type of OTP codes. This helps distinguish temporary
  codes for linking a TV/device from PHONE or EMAIL identity values.
  */
  await queryInterface.sequelize.query(
    `ALTER TYPE "enum_otp_type" ADD VALUE 'LINK_CODE'`
  );

  /*
  Adds a reference column to an OpenID Identity. Allows us to associate an OTP Code
  with an authenticated/known user.
  */
  await queryInterface.addColumn('otp', 'person_id', {
    type: Sequelize.UUID,
  });

  // Deleting people will delete corresponding OTP rows
  await queryInterface.addConstraint('otp', {
    fields: ['person_id'],
    type: 'foreign key',
    references: {
      table: 'people',
      field: 'id',
    },
    onDelete: 'cascade',
  });
}

async function down({ context: queryInterface }) {
  // enum_otp_type value
  await queryInterface.sequelize.query(`
    DELETE 
    FROM
      pg_enum
    WHERE
      enumlabel = 'LINK_CODE' AND
      enumtypid = (
        SELECT
          oid
        FROM
          pg_type
        WHERE
          typname = 'enum_otp_type'
      )
  `);

  // person_id column
  await queryInterface.removeConstraint('otp', 'otp_person_id_people_fk');
  await queryInterface.removeColumn('otp', 'person_id');
}

const name = '073_support_link_codes';

module.exports = { up, down, name };
