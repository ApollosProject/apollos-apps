const churchIdTables = [
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

const nameTables = ['church'];

async function up({ context: queryInterface }) {
  await Promise.all(
    churchIdTables.map(async (t) => {
      await queryInterface.renameColumn(`${t}`, 'church_id', 'church_slug');
    }),
    nameTables.map(async (t) => {
      await queryInterface.renameColumn(`${t}`, 'name', 'slug');
    })
  );
}

async function down({ context: queryInterface }) {
  await Promise.all(
    churchIdTables.map(async (t) => {
      await queryInterface.renameColumn(`${t}`, 'church_slug', 'church_id');
    }),
    nameTables.map(async (t) => {
      await queryInterface.renameColumn(`${t}`, 'slug', 'name');
    })
  );
}

const name = '005-rename-church-id-to-church-slug';

module.exports = { up, down, name };
