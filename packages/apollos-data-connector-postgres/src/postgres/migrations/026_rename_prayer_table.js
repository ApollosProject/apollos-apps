async function up({ context: queryInterface }) {
  await queryInterface.renameTable('prayer', 'prayer_request');
}

async function down({ context: queryInterface }) {
  await queryInterface.renameTable('prayer_request', 'prayer');
}

const name = '002-rename-prayer-table';

module.exports = { up, down, name };
