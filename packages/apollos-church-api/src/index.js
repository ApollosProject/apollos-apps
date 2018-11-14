import config from './config'; // eslint-disable-line
import server from './server';

export { testSchema } from './server'; // eslint-disable-line import/prefer-default-export

// Use the port, if provided.
const { PORT } = process.env;
if (!PORT && process.env.NODE_ENV !== 'test') console.log(process.env.NODE_ENV);
console.warn(
  'Add `ENV=4000` if you are having trouble connecting to the server. By default, PORT is random.'
);

server.listen({ port: PORT }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
