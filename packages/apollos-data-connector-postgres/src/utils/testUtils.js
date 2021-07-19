import createMigrationRunner from '../postgres/performMigrations';

export const setupPostgresTestEnv = async (models = []) => {
  await Promise.all(
    models.map((m) => {
      return m.models.createModel && m.models.createModel();
    })
  );

  const migrationRunner = await createMigrationRunner({
    migrations: models.map(({ migrations }) => migrations).filter((m) => !!m),
    logger: null,
  });
  await migrationRunner.up();

  await Promise.all(
    models.map((m) => {
      return m.models.setupModel && m.models.setupModel();
    })
  );
};
