import { PostgresDataSource } from '../postgres';

class CommentDataSource extends PostgresDataSource {
  modelName = 'comments';
}

export { CommentDataSource as default };
