import ApollosConfig from '@apollosproject/config';
import { Client } from 'pg';
import { sequelize } from './src/postgres/index';

// afterAll(async () => {
//   await sequelize.dropAllSchemas();
//   await sync();
// });

export default async () => {
  console.log('tearing down');
  await sequelize.dropAllSchemas();
  await sequelize.close();

  if (!ApollosConfig?.DATABASE?.URL) {
    const dbName = `${process.env.NODE_ENV || 'development'}`;
    // If there's no configured DB url, create a local database
    const client = new Client({
      host: 'localhost',
      database: 'postgres',
    });

    console.log('client created, connecting...');

    await client.connect();

    console.log(`connected, dropping ${dbName}`);

    try {
      await client.query(`DROP DATABASE ${dbName} WITH (FORCE)`);
      console.log(`dropped ${dbName}`);
    } catch (e) {
      // db must not exist
      console.log(`doesn't exist`);
      console.error(e);
    } finally {
      await client.end();
      console.log('ending');
    }
  }

  return true;
};
