export {
  defineModel,
  configureModel,
  sequelize,
  sync,
  PostgresDataSource,
} from './postgres';

export * as Comment from './comments';
export * as UserFlag from './user-flags';
export * as Follow from './follows';
export * as Person from './people';
export * as Campus from './campus';
