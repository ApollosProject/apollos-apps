import { Umzug, SequelizeStorage } from 'umzug';
import { sequelize } from './index';

const createMigrationRunner = async ({ logger = console }) => {
  const umzug = new Umzug({
    migrations: { glob: `${__dirname}/migrations/*.js` },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger,
    create: {
      folder: `${__dirname}/migrations`,
    },
  });

  // Checks migrations and run them if they are not already applied. To keep
  // track of the executed migrations, a table (and sequelize model) called SequelizeMeta
  // will be automatically created (if it doesn't exist already) and parsed.
  return umzug;
};

export default createMigrationRunner;
