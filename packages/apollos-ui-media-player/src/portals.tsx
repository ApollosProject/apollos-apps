import * as React from 'react';
import { Platform, requireNativeComponent } from 'react-native';

interface PortalOriginProps {
  destination: string | null;
  style?: any;
  children: any;
}

interface PortalDestinationProps {
  name: string;
}

const PortalOrigin: React.FunctionComponent<PortalOriginProps> = (props) => (
  <RCTPortalOrigin {...props} />
);

const PortalDestination: React.FunctionComponent<PortalDestinationProps> = (
  props
) => <RCTPortalDestination {...props} />;

const RCTPortalOrigin =
  Platform.OS === 'ios'
    ? requireNativeComponent('RCTPortalOrigin')
    : React.Fragment;
const RCTPortalDestination =
  Platform.OS === 'ios'
    ? requireNativeComponent('RCTPortalDestination')
    : React.Fragment;

export { PortalOrigin, PortalDestination };
