import { DataTypes } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.createTable('media', {
    type: DataTypes.ENUM(['IMAGE', 'VIDEO', 'AUDIO']),
    url: DataTypes.STRING,
    nodeId: DataTypes.UUID,
    nodeType: DataTypes.STRING,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('media');
}

const name = '001-create-media';

module.exports = { up, down, name, order: 4 };
