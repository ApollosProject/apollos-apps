import { createContext } from 'react';

export const requestPermissions = () => null;
export const PushContext = createContext({
  hasPrompted: true,
  hasPushPermission: true,
  loading: true,
  checkPermissions: () => {}, // deprecated, confusing name
  updatePermissionStatus: () => {},
});
