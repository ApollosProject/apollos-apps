import { Sequelize } from 'sequelize';
// import { defineModel, configureModel } from '../postgres';
//
// const createModel = defineModel({
//   modelName: 'campus',
//   resolveType: () => 'Campus',
//   external: true,
//   attributes: {
//     name: DataTypes.TEXT,
//     street1: DataTypes.TEXT,
//     street2: DataTypes.TEXT,
//     city: DataTypes.TEXT,
//     state: DataTypes.TEXT,
//     postalCode: DataTypes.TEXT,
//     latitude: DataTypes.FLOAT,
//     longitude: DataTypes.FLOAT,
//     imageUrl: DataTypes.TEXT,
//     digital: DataTypes.BOOLEAN,
//   },
// });
//
// const setupModel = configureModel(({ sequelize }) => {
//   sequelize.models.campus.hasMany(sequelize.models.people);
//   sequelize.models.people.belongsTo(sequelize.models.campus);
// });
//
// export { createModel, setupModel };

async function up({ context: queryInterface }) {
  await queryInterface.createTable('campuses', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
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
    name: {
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
  await queryInterface.dropTable('users');
}

const name = '001-create-campus';

module.exports = { up, down, name };
