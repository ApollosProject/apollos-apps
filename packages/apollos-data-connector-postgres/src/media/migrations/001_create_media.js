import { DataTypes, Sequelize } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.createTable('media', {
    originId: {
      primaryKey: true,
      type: Sequelize.STRING,
      allowNull: false,
    },
    originType: { type: Sequelize.STRING, allowNull: false },
    type: DataTypes.ENUM(['IMAGE', 'VIDEO', 'AUDIO']),
    url: DataTypes.STRING,
    nodeId: DataTypes.UUID,
    nodeType: DataTypes.STRING,
  });
  await queryInterface.addIndex('media', ['originId', 'originType'], {
    unique: true,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('media');
}

const name = '001-create-media';

module.exports = { up, down, name, order: 4 };
