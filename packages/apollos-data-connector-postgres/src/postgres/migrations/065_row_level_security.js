import { Sequelize } from 'sequelize';

const tables = [
  'campus',
  'comment',
  'content_item',
  'content_item_category',
  'content_item_connection',
  'content_tag',
  'feature',
  'follow',
  'interaction',
  'media',
  'notification',
  'notification_preference',
  'people',
  'people_tag',
  'person_prayed_for',
  'prayer_request',
  'tag',
  'user_flag',
  'user_like',
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
    })
  );
}

async function down({ context: queryInterface }) {
  await Promise.all(
    tables.map(async (t) => {
      await queryInterface.sequelize.query(
        `DROP POLICY church_tenant_${t} ON ${t}`
      );
      await queryInterface.removeColumn(
        t, // table name
        'church_id' // new field name
      );
    })
  );
}

const name = '002-row-level-security';

module.exports = { up, down, name };
