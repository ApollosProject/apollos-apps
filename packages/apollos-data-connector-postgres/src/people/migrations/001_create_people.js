import { DataTypes, Sequelize } from 'sequelize';

const Gender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  UNKNOWN: 'UNKNOWN',
};

async function up({ context: queryInterface }) {
  await queryInterface.createTable('people', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    birthDate: DataTypes.DATE,
    profileImageUrl: DataTypes.STRING,
    gender: DataTypes.ENUM(Object.values(Gender)),
    apollosUser: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
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
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('people');
}

const name = '001-create-people';

module.exports = { up, down, name, order: 1 };
