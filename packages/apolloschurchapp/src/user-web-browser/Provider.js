import { createContext } from 'react';
import NavigationService from '../NavigationService';

// Can can either call the OpenUserWebView function directly, or call it using the Consuemer.
// Your choice.
export const OpenUserWebView = (url) =>
  NavigationService.navigate('UserWebView', { url });

const { Provider } = createContext(OpenUserWebView);

export { Provider as UserWebBrowserProvider };
