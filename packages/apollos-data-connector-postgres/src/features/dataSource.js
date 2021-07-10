import { PostgresDataSource } from '../postgres';

class Feature extends PostgresDataSource {
  modelName = 'features';
}

export { Feature as default };
