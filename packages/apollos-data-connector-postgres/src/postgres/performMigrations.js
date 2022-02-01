import { flatten, groupBy } from 'lodash';
import { Umzug, SequelizeStorage } from 'umzug';
import systemMigrations from './migrations';
import { sequelize } from './index';

const createMigrationRunner = async ({ migrations, logger = console }) => {
  const migrationsToRun = flatten([...systemMigrations, ...migrations]);

  migrationsToRun.sort((a, b) => (a.order < b.order ? -1 : 1));

  if (process.env.NODE_ENV !== 'test') {
    const migrationsGroupedByOrder = Object.entries(
      groupBy(migrationsToRun, 'order')
    );

    console.log('📋 Migrations to be run:');

    migrationsGroupedByOrder.forEach(([order, migs]) => {
      const sortedMigrations = migs.sort((a, b) => (a.name < b.name ? -1 : 1));
      console.log(`\nOrder #${order}`);
      console.log(sortedMigrations.map(({ name }) => `•  ${name}`).join('\n'));
    });

    console.log('\nPausing for review (2s)...');

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  const umzug = new Umzug({
    migrations: migrationsToRun,
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger,
  });

  // Checks migrations and run them if they are not already applied. To keep
  // track of the executed migrations, a table (and sequelize model) called SequelizeMeta
  // will be automatically created (if it doesn't exist already) and parsed.
  return umzug;
};

export default createMigrationRunner;
