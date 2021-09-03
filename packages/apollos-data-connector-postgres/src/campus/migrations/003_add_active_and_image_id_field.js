import { Sequelize } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.addColumn('campus', 'active', {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  });

  await queryInterface.addColumn('campus', 'image_id', {
    type: Sequelize.UUID,
    references: {
      model: {
        tableName: 'media',
      },
      key: 'id',
    },
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('campus', 'active');
  await queryInterface.removeColumn('campus', 'image_id');
}

const name = '003-add-active-and-image-id-field';

module.exports = { up, down, name, order: 8 };
