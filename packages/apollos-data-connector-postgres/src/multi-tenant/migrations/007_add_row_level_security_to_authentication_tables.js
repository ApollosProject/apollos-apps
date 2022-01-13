import { Sequelize } from 'sequelize';

const tables = [
  'otp',
  'open_id_identity',
  'refresh_token'
];

async function up({ context: queryInterface }) {
  await Promise.all(
    tables.map(async (t) => {
      await queryInterface.addColumn(
        t, // table name
        'church_id', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE ${t} ENABLE ROW LEVEL SECURITY;`
      );
      await queryInterface.sequelize.query(
        `CREATE POLICY church_tenant_${t} ON ${t} USING (church_id = current_user);`
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE ${t} ALTER COLUMN church_id SET DEFAULT current_user;`
      );      
    })
  );  
}

async function down({ context: queryInterface }) {
  await Promise.all(tables.map(async (t) => {
    await queryInterface.sequelize.query(
      `DROP POLICY church_tenant_${t} ON ${t}`
    );
    await queryInterface.removeColumn(
      t, // table name
      'church_id' // new field name
    );
  }));
}

const name = '007-add-row-level-security-to-authentication-table';

module.exports = { up, down, name, order: 14 };
