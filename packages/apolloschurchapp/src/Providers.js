import { nest } from 'recompose';
import { Providers } from '@apollosproject/ui-kit';
import { Provider as AuthProvider } from '@apollosproject/ui-auth';
import ClientProvider from './client';

export default nest(ClientProvider, AuthProvider, Providers);
