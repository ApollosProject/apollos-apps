import { Sequelize } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.createTable('refresh_token', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
    },
    jwt_token: {
      type: Sequelize.TEXT,
      unique: true,
    },
    expires_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    person_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'people',
        key: 'id',
      },
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
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('refresh_token');
}

const name = '001-create-refresh-tokens';

module.exports = { up, down, name, order: 3 };
