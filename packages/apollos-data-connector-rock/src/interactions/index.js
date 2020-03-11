/* eslint-disable import/prefer-default-export */
import { interactionsSchema as schema } from '@apollosproject/data-schema';

import dataSource from './data-source';
import resolver from './resolver';

export { dataSource, schema, resolver };
