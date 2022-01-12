/* eslint-disable import/prefer-default-export */
import createMigrationRunner from '../postgres/performMigrations';

export const setupPostgresTestEnv = async (models = [], context) => {
  if (context.church.slug !== 'global') {
    await setupPostgresTestEnv(models, { church: { slug: 'global' } });
  }
  await Promise.all(
    models.map((m) => m.models.createModel && m.models.createModel(context))
  );

  const migrationRunner = await createMigrationRunner({
    migrations: models.map(({ migrations }) => migrations).filter((m) => !!m),
    logger: null,
  });
  await migrationRunner.up();

  await Promise.all(
    models.map((m) => m.models.setupModel && m.models.setupModel(context))
  );
};
