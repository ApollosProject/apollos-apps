async function up({ context: queryInterface }) {
  await queryInterface.addIndex('features', ['parentId', 'type', 'data'], {
    unique: true,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.removeIndex('features', 'features_parent_id_type_data');
}

const name = '002-add-unique_index_for_features';

module.exports = { up, down, name };
