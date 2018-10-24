import path from 'path';
import ApollosConfig from '@apollos/config';

const { config } = new ApollosConfig({
  pathName: path.join(__dirname, '..', 'config.yml'),
});

export default config;
