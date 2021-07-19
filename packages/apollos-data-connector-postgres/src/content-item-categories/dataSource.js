import { PostgresDataSource } from '../postgres';

export default class ContentChannel extends PostgresDataSource {
  modelName = 'contentItemCategory';
}
