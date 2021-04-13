import { Sequelize } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.sequelize.transaction(async (t) => {
    await queryInterface.addColumn(
      'user_likes',
      'nodeIdUuid',
      {
        type: Sequelize.UUID,
      },
      { transaction: t }
    );
    // I hate straight up writing sql here, but I couldn't get `update` to fire inside the transaction for whatever reason
    await queryInterface.sequelize.query(
      `UPDATE user_likes SET "nodeIdUuid" = uuid("nodeId")`,
      { transaction: t }
    );
    await queryInterface.removeColumn('user_likes', 'nodeId', {
      transaction: t,
    });
    await queryInterface.renameColumn('user_likes', 'nodeIdUuid', 'nodeId', {
      transaction: t,
    });
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.sequelize.transaction(async (t) => {
    await queryInterface.addColumn(
      'user_likes',
      'nodeIdText',
      {
        type: Sequelize.TEXT,
      },
      { transaction: t }
    );
    // I hate straight up writing sql here, but I couldn't get `update` to fire inside the transaction for whatever reason
    await queryInterface.sequelize.query(
      `UPDATE user_likes SET "nodeIdText" = "nodeId"`,
      { transaction: t }
    );
    await queryInterface.removeColumn('user_likes', 'nodeId', {
      transaction: t,
    });
    await queryInterface.renameColumn('user_likes', 'nodeIdText', 'nodeId', {
      transaction: t,
    });
  });
}

const name = '002-update-user-likes-node-id-to-uuid';

module.exports = { up, down, name, order: 4 };
