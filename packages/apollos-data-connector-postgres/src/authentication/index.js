import { get } from 'lodash';
import { authenticationSchema } from '@apollosproject/data-schema';
import dataSource from './data-source';
import resolver from './resolver';
import { registerToken } from './token';

export * as models from './model';

export { dataSource, resolver, authenticationSchema as schema };

export const contextMiddleware = ({ req, context: ctx }) => {
  if (
    get(req, 'headers.authorization') &&
    req.headers.authorization.includes('Bearer')
  ) {
    const { personId } = registerToken(
      req.headers.authorization.split('Bearer ')[1]
    );
    if (personId) {
      return {
        ...ctx,
        personId,
      };
    }
  }
  return ctx;
};
