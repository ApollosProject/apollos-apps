import resolver from './resolver';
import dataSource from './data-source';

export { resolver, dataSource };
export { passSchema as schema } from '@apollosproject/data-schema';

const serverMiddleware = ({ app }) => {
  app.get('/pass', (req, res) => {
    res.send('hello-world');
  });
};

export { serverMiddleware };
