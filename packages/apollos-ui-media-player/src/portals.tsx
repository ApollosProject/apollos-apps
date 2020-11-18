import * as React from 'react';
import { requireNativeComponent } from 'react-native';

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

const RCTPortalOrigin = requireNativeComponent('RCTPortalOrigin');
const RCTPortalDestination = requireNativeComponent('RCTPortalDestination');

export { PortalOrigin, PortalDestination };
