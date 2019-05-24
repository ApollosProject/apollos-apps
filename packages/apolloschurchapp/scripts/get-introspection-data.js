const fs = require('fs');
const Path = require('path');
require('dotenv/config');
const crypto = require('crypto');
const fetch = require('node-fetch');

const attempts = 0;
const maxAttempts = 3;
const timeBetweenAttempts = 5 * 1000;

const getIntrospectionData = async () => {
  try {
    const query = await fetch(process.env.APP_DATA_URL, {
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

    console.log('Successfully wrote fragmentTypes!');
  } catch (e) {
    if (attempts < maxAttempts) {
      console.log(
        `Error writing fragmentTypes (-api probably hasn't started yet). Trying again after wait. Attempt: ${attempts +
          1} of ${maxAttempts}`
      );
      await new Promise((resolve) => setTimeout(resolve, timeBetweenAttempts)); // try again after waiting
      getIntrospectionData();
    } else {
      // throw new Error('Error writing fragmentTypes file', e);
    }
  }
};

const generateSchemaHash = async () => {
  try {
    const query = await fetch(process.env.APP_DATA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
query IntrospectionQuery {
  __schema {
    queryType {
      name
    }
    mutationType {
      name
    }
    subscriptionType {
      name
    }
    types {
      ...FullType
    }
    directives {
      name
      description
      locations
      args {
        ...InputValue
      }
    }
  }
}

fragment FullType on __Type {
  kind
  name
  description
  fields(includeDeprecated: true) {
    name
    description
    args {
      ...InputValue
    }
    type {
      ...TypeRef
    }
    isDeprecated
    deprecationReason
  }
  inputFields {
    ...InputValue
  }
  interfaces {
    ...TypeRef
  }
  enumValues(includeDeprecated: true) {
    name
    description
    isDeprecated
    deprecationReason
  }
  possibleTypes {
    ...TypeRef
  }
}

fragment InputValue on __InputValue {
  name
  description
  type {
    ...TypeRef
  }
  defaultValue
}

fragment TypeRef on __Type {
  kind
  name
  ofType {
    kind
    name
    ofType {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
              }
            }
          }
        }
      }
    }
  }
}
        `,
      }),
    });

    const { data } = await query.json();
    const queryString = JSON.stringify(data);
    const schemaHash = crypto
      .createHash('md5')
      .update(queryString)
      .digest('hex');

    await fs.writeFileSync(
      Path.resolve(__dirname, '../src/client/schemaHash.json'),
      JSON.stringify({ schemaHash })
    );

    console.log('Successfully wrote schema hash!');
  } catch (e) {
    if (attempts < maxAttempts) {
      console.log(
        `Error writing schema hash (-api probably hasn't started yet). Trying again after wait. Attempt: ${attempts +
          1} of ${maxAttempts}`
      );
      await new Promise((resolve) => setTimeout(resolve, timeBetweenAttempts)); // try again after waiting
      generateSchemaHash();
    } else {
      // throw new Error('Error writing fragmentTypes file', e);
    }
  }
};

(async () => {
  await getIntrospectionData();
  await generateSchemaHash();
})();
