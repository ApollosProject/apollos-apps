function up({ context: queryInterface }) {
  queryInterface.removeIndex('prayer_request', 'prayer_origin_id_origin_type');
}

function down({ context: queryInterface }) {
  queryInterface.addIndex('prayer_request', {
    name: 'prayer_origin_id_origin_type',
    fields: ['origin_id', 'origin_type'],
    unique: true,
  });
}

const name = '008-remove-incorrect-prayer-index';

module.exports = { up, down, name, order: 15 };
