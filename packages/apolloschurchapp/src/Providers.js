import { nest } from 'recompose';
import { Providers } from '@apollosproject/ui-kit';

import ClientProvider from './client';
import { NotificationsManager } from './notifications';

export default nest(ClientProvider, Providers, NotificationsManager);
