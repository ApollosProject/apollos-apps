import ApollosConfig from '@apollosproject/config';
import { Client } from 'pg';
import { sequelize } from './src/postgres/index';

export default async () => {
  await sequelize.dropAllSchemas();
  await sequelize.close();

  if (!ApollosConfig?.DATABASE?.URL) {
    const dbName = `${process.env.NODE_ENV || 'development'}`;
    // If there's no configured DB url, create a local database
    const client = new Client({
      host: 'localhost',
      database: 'postgres',
    });

    await client.connect();

    try {
      await client.query(`DROP DATABASE ${dbName} WITH (FORCE)`);
    } catch (e) {
      // db must not exist
    } finally {
      await client.end();
    }
  }

  return true;
};
