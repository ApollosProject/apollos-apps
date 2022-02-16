/* eslint-disable import/prefer-default-export */
import createMigrationRunner from '../postgres/performMigrations';
import { sequelize } from '../postgres';

export const setupPostgresTestEnv = async (models = [], context) => {
  if (context.church.slug !== 'global') {
    await setupPostgresTestEnv(models, { church: { slug: 'global' } });
  }

  try {
    // If we don't have a set of migrations.
    // Hacky way of saying - have the migrations been run?
    await sequelize
      .getQueryInterface()
      .sequelize.query('select * from "SequelizeMeta"');
  } catch (e) {
    const migrationRunner = await createMigrationRunner({
      logger: null,
    });
    await migrationRunner.up();
  }

  await Promise.all(
    models.map((m) => m.models.createModel && m.models.createModel(context))
  );

  await Promise.all(
    models.map((m) => m.models.setupModel && m.models.setupModel(context))
  );
};
