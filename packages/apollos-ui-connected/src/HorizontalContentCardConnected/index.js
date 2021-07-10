import React from 'react';
import { HorizontalDefaultCard } from '@apollosproject/ui-kit';
import HorizontalContentCardConnected from './HorizontalContentCardConnected';

export const HorizontalContentCardComponentMapper = (props) => {
  console.warn('HorizontalContentCardComponentMapper is deprecated');
  return <HorizontalDefaultCard {...props} />;
};

export default HorizontalContentCardConnected;
