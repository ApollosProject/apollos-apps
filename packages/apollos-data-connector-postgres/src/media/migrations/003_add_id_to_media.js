import { Sequelize } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.addColumn('media', 'id', {
    type: Sequelize.UUID,
    defaultValue: Sequelize.literal('uuid_generate_v4()'),
  });

  await queryInterface.addConstraint('media', {
    fields: ['id'],
    type: 'primary key',
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('media', 'id');
}

const name = '003-add-id-to-media';

module.exports = { up, down, name, order: 6 };
