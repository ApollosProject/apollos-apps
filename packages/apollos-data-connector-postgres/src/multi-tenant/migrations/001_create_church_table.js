import { Sequelize, DataTypes } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.createTable('church', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: queryInterface.sequelize.literal('uuid_generate_v4()'),
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
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
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });
  await queryInterface.createTable('church_route', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: queryInterface.sequelize.literal('uuid_generate_v4()'),
    },
    route_name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    church_id: {
      type: Sequelize.UUID,
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
  await queryInterface.addConstraint('church_route', {
    fields: ['church_id'],
    type: 'foreign key',
    references: {
      table: 'church',
      field: 'id',
    },
    onDelete: 'cascade',
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('church_route');
  await queryInterface.dropTable('church');
}

const name = '001-create-church-table';

module.exports = { up, down, name, order: 7 };
