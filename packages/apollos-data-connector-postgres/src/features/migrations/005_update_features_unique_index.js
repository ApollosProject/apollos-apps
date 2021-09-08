async function up({ context: queryInterface }) {
  await queryInterface.removeIndex('feature', 'features_parent_id_type_data');
  await queryInterface.addIndex(
    'feature',
    ['parent_id', 'priority', 'type', 'data', 'priority'],
    {
      unique: true,
    }
  );
}

async function down({ context: queryInterface }) {
  await queryInterface.removeIndex(
    'feature',
    'features_parent_id_priority_type_data'
  );
}

const name = '005-update-features-unique-index';

module.exports = { up, down, name, order: 9 };
