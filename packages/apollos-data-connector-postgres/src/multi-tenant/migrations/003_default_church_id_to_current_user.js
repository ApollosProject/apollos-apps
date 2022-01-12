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
      await queryInterface.sequelize.query(
        `ALTER TABLE ${t} ALTER COLUMN church_id SET DEFAULT current_user;`
      );
    })
  );
}

async function down({ context: queryInterface }) {
  await Promise.all(
    tables.map(async (t) => {
      await queryInterface.sequelize.query(
        `ALTER TABLE ${t} ALTER COLUMN church_id SET DEFAULT NULL;`
      );
    })
  );
}

const name = '003-default-church-id-to-current-user';

module.exports = { up, down, name, order: 11 };
