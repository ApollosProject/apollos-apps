import { Sequelize } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.addColumn('media', 'id', {
    type: Sequelize.UUID,
    defaultValue: Sequelize.literal('uuid_generate_v4()'),
  });

  await queryInterface.addColumn('media', 'apollosId', {
    type: Sequelize.STRING,
    allowNull: true,
  });
  await queryInterface.addColumn('media', 'apollosType', {
    type: Sequelize.STRING,
    allowNull: false,
  });

  await queryInterface.addColumn('media', 'createdAt', {
    type: Sequelize.DATE,
    allowNull: false,
  });

  await queryInterface.addColumn('media', 'updatedAt', {
    type: Sequelize.DATE,
    allowNull: false,
  });

  await queryInterface.addConstraint('media', {
    fields: ['apollosId'],
    type: 'unique',
  });

  await queryInterface.addConstraint('media', {
    fields: ['id'],
    type: 'primary key',
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('media', 'id');
  await queryInterface.removeColumn('apollosId', 'id');
  await queryInterface.removeColumn('apollosType', 'id');
  await queryInterface.removeColumn('createdAt', 'id');
  await queryInterface.removeColumn('updatedAt', 'id');
}

const name = '003-add-id-to-media';

module.exports = { up, down, name, order: 6 };
