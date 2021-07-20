async function up({ context: queryInterface }) {
  // Deleting content item will delete content_tag
  await queryInterface.addConstraint('content_tag', {
    fields: ['contentItemId'],
    type: 'foreign key',
    references: {
      table: 'contentItems',
      field: 'id',
    },
    onDelete: 'cascade',
  });

  // Deleting tag will delete the content_tag
  await queryInterface.addConstraint('content_tag', {
    fields: ['tagId'],
    type: 'foreign key',
    references: {
      table: 'tags',
      field: 'id',
    },
    onDelete: 'cascade',
  });

  // Deleting person will delete people_tag
  await queryInterface.addConstraint('people_tag', {
    fields: ['personId'],
    type: 'foreign key',
    references: {
      table: 'people',
      field: 'id',
    },
    onDelete: 'cascade',
  });

  // Deleting tag will delete the people_tag
  await queryInterface.addConstraint('people_tag', {
    fields: ['tagId'],
    type: 'foreign key',
    references: {
      table: 'tags',
      field: 'id',
    },
    onDelete: 'cascade',
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.removeConstraint(
    'content_tag',
    'content_tag_contentItemId_contentItems_fk'
  );
  await queryInterface.removeConstraint(
    'content_tag',
    'content_tag_tagId_tags_fk'
  );
  await queryInterface.removeConstraint(
    'people_tag',
    'people_tag_tagId_tags_fk'
  );
  await queryInterface.removeConstraint(
    'people_tag',
    'people_tag_personId_people_fk'
  );
}

const name = '004_update_tag_foreign_key_constraints';

module.exports = { up, down, name, order: 6 };
