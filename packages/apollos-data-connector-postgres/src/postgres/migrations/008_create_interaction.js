import { Sequelize } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.createTable('interaction', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
    },
    person_id: {
      type: Sequelize.UUID,
      references: {
        model: 'people',
        key: 'id',
      },
    },
    action: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    arguments: {
      type: Sequelize.JSONB,
    },
    node_id: { type: Sequelize.UUID },
    node_type: { type: Sequelize.TEXT },
    origin_id: { type: Sequelize.TEXT, allowNull: true },
    origin_type: { type: Sequelize.STRING, allowNull: true },
    apollos_id: {
      type: Sequelize.STRING,
      allowNull: true, // we set this value with an "afterCreate" hook if not set.
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
  await queryInterface.dropTable('interaction');
}

const name = '001-create-interaction';

module.exports = { up, down, name };
