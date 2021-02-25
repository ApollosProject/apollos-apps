import { Client } from 'pg';

/**
 * Given a connected postgres Client: connect and ensure the named database is created with all necessary extensions.
 *
 * @param {Client} client;
 * @param {string} name;
 */
const ensureLocalDb = async (client, name) => {
  try {
    await client.query(`DROP DATABASE IF EXISTS ${name};`);
  } catch (e) {
    console.error(`Failed to drop local database ${name}`);
    console.error(e);
  }

  try {
    await client.query(`CREATE DATABASE ${name};`);
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
