import { Sequelize } from 'sequelize';

const IDENTITY_TYPES = {
  EMAIL: 'EMAIL',
  PHONE: 'PHONE',
};

async function up({ context: queryInterface }) {
  await queryInterface.createTable('otp', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
    },
    apollos_id: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    },
    apollos_type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    code: {
      type: Sequelize.TEXT,
      unique: true,
      allowNull: false,
    },
    type: {
      type: Sequelize.ENUM(Object.values(IDENTITY_TYPES)),
      allowNull: false,
    },
    identity: {
      type: Sequelize.TEXT,
      unique: true,
      allowNull: false,
    },
    expires_at: {
      type: Sequelize.DATE,
      unique: false,
      allowNull: false,
    },
    created_at: {
      type: Sequelize.DATE,
      unique: false,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: Sequelize.DATE,
      unique: false,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('otp');
}

const name = '001-add-otp-table';

module.exports = { up, down, name };
