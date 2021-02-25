import { Client } from 'pg';

/**
 * Given a connected postgres Client: connect and ensure the named database is created with all necessary extensions.
 *
 * @param {Client} client;
 * @param {string} name;
 */
const ensureLocalDb = async (client, name, drop = false) => {
  if (drop) {
    try {
      await client.query(`DROP DATABASE IF EXISTS ${name};`);
    } catch (e) {
      console.error(`Failed to drop local database ${name}`);
      console.error(e);
    }
  }

  try {
    await client.query(`CREATE DATABASE ${name};`);
    // If we want to check first, and are willing to install dblink, we could do this instead:
    // await client.query(
    //   `DO $do$ BEGIN IF NOT EXISTS (SELECT FROM pg_database WHERE datname = '${name}') THEN PERFORM dblink_exec('dbname=' || current_database(), 'CREATE DATABASE ${name}'); END IF; END $do$;`
    // );
  } catch (e) {
    // Assume the database already exists
    console.log('database already exists');
  }

  try {
    const dbTestClient = new Client({
      host: 'localhost',
      database: name,
    });
    await dbTestClient.connect();
    await dbTestClient.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    await dbTestClient.end();
  } catch (e) {
    console.error(`Failed to create test database ${name}`);
    console.error(e);
  }
};

export { ensureLocalDb };
