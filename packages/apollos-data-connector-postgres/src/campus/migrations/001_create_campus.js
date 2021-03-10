import { Sequelize } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.createTable('campuses', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
    },
    name: Sequelize.STRING,
    street1: Sequelize.TEXT,
    street2: Sequelize.TEXT,
    city: Sequelize.TEXT,
    state: Sequelize.TEXT,
    postalCode: Sequelize.TEXT,
    latitude: Sequelize.FLOAT,
    longitude: Sequelize.FLOAT,
    imageUrl: Sequelize.TEXT,
    digital: Sequelize.BOOLEAN,
    apollosId: {
      type: Sequelize.STRING,
      allowNull: true, // we set this value with an "afterCreate" hook if not set.
      unique: true,
    },
    apollosType: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    originId: { type: Sequelize.STRING, allowNull: false },
    originType: { type: Sequelize.STRING, allowNull: false },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });
  await queryInterface.addIndex('campuses', ['originId', 'originType'], {
    unique: true,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('campuses');
}

const name = '001-create-campus';

module.exports = { up, down, name, order: 1 };
