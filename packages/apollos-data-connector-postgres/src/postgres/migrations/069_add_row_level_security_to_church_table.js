async function up({ context: queryInterface }) {
  // Church table.
  await queryInterface.sequelize.query(
    `ALTER TABLE church ENABLE ROW LEVEL SECURITY;`
  );
  await queryInterface.sequelize.query(
    `CREATE POLICY church_tenant_church ON church USING (slug = current_user);`
  );
}

async function down({ context: queryInterface }) {
  await queryInterface.sequelize.query(
    `DROP POLICY church_tenant_church ON church`
  );
}

const name = '006-add-row-level-security-to-church-table';

module.exports = { up, down, name };
