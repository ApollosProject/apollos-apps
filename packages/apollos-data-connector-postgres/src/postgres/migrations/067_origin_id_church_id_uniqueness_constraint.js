const tables = [
  'campus',
  'content_item',
  'content_item_category',
  'content_item_connection',
  'media',
  'people',
  'prayer_request',
  'tag',
];

async function up({ context: queryInterface }) {
  await Promise.all(
    tables.map(async (t) => {
      await queryInterface.removeIndex(`${t}`, ['origin_id', 'origin_type']);
      await queryInterface.removeIndex(`${t}`, `${t}s_origin_id_origin_type`);
      await queryInterface.removeIndex(`${t}`, `${t}es_origin_id_origin_type`);
      await queryInterface.removeIndex(
        `${t}`,
        `${t
          .split('_')
          .map((w, i) => (i === 0 ? w : `${w}s`))
          .join('_')}_origin_id_origin_type`
      );
      await queryInterface.addIndex(`${t}`, {
        fields: ['origin_id', 'church_id', 'origin_type'],
        unique: true,
      });
    })
  );
  // not really a clever easy solution for this one :/
  await queryInterface.removeIndex(
    'content_item_category',
    'content_item_categories_origin_id_origin_type'
  );
}

async function down({ context: queryInterface }) {
  await Promise.all(
    tables.map(async (t) => {
      await queryInterface.removeIndex(`${t}`, [
        'origin_id',
        'church_id',
        'origin_type',
      ]);
    })
  );
}

const name = '004-origin-id-church-id-uniqueness-constraint';

module.exports = { up, down, name };
