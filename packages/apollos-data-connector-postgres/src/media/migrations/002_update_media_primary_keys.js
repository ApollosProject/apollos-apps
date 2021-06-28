import { Sequelize } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.sequelize.transaction(async (t) => {
    await queryInterface.addColumn(
      'media',
      'originId',
      {
        type: Sequelize.STRING,
        allowNull: false,
      },
      { transaction: t }
    );
    await queryInterface.addColumn(
      'media',
      'originType',
      { type: Sequelize.STRING, allowNull: false },
      { transaction: t }
    );

    await queryInterface.addIndex('media', ['originId', 'originType'], {
      unique: true,
      transaction: t,
    });
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('media');
}

const name = '002-update_media_primary_keys';

module.exports = { up, down, name, order: 5 };
