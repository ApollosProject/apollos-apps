import { Sequelize, DataTypes } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.createTable('prayer', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
    },
    text: {
      type: DataTypes.TEXT,
    },
    person_id: {
      type: Sequelize.UUID,
      references: {
        model: 'people',
        key: 'id',
      },
    },
    origin_id: { type: Sequelize.STRING, allowNull: true },
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
  await queryInterface.addIndex('prayer', ['origin_id', 'origin_type'], {
    unique: true,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('prayer');
}

const name = '001-create-prayers';

module.exports = { up, down, name, order: 3 };
