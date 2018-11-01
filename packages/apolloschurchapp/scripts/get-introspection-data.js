import fs from 'fs';
import Path from 'path';
import { APP_DATA_URL } from 'react-native-dotenv';
import fetch from 'node-fetch';

(async () => {
  try {
    const query = await fetch(APP_DATA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          {
            __schema {
              types {
                kind
                name
                possibleTypes {
                  name
                }
              }
            }
          }
        `,
      }),
    });

    const { data } = await query.json();

    /* eslint no-underscore-dangle: 0 */
    data.__schema.types = await data.__schema.types.filter(
      (type) => type.possibleTypes !== null
    );

    await fs.writeFileSync(
      Path.resolve(__dirname, '../src/client/fragmentTypes.json'),
      JSON.stringify(data)
    );
  } catch (e) {
    throw new Error('Error writing fragmentTypes file', e);
  }
})();
