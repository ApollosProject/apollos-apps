import { Sequelize } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.createTable('open_id_identity', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: queryInterface.sequelize.literal('uuid_generate_v4()'),
    },
    apollos_id: {
      type: Sequelize.STRING,
      allowNull: true, // we set this value with an "afterCreate" hook if not set.
      unique: true,
    },
    apollos_type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    person_id: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    access_token: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    refresh_token: {
      type: Sequelize.TEXT,
    },
    id_token: {
      type: Sequelize.TEXT,
    },
    provider_type: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });
  await queryInterface.addConstraint('open_id_identity', {
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
  await queryInterface.dropTable('open_id_identity');
}

const name = '001-create-open-id-identity';

module.exports = { up, down, name, order: 7 };
