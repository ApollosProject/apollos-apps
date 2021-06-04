export {
  defineModel,
  configureModel,
  sequelize,
  sync,
  PostgresDataSource,
} from './postgres';

export * as Comment from './comments';
export * as UserFlag from './user-flags';
export * as UserLike from './user-likes';
export * as Follow from './follows';
export * as Person from './people';
export * as Campus from './campus';
export * as Notification from './notifications';
export * as NotificationPreference from './notification-preferences';

export createMigrationRunner from './postgres/performMigrations';
