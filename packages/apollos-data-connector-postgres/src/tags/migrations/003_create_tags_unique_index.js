async function up({ context: queryInterface }) {
  await queryInterface.addIndex('tags', ['originId', 'originType'], {
    unique: true,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropIndex('tags_origin_id_origin_type');
}

const name = '003-create-tags-unique_index';

module.exports = { up, down, name, order: 5 };
