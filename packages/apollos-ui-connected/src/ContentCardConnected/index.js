import React from 'react';
import { DefaultCard } from '@apollosproject/ui-kit';
import ContentCardConnected from './ContentCardConnected';

export const ContentCardComponentMapper = (props) => {
  console.warn('ContentCardComponentMapper deprecated');
  return <DefaultCard {...props} />;
};

export { default as GET_CONTENT_CARD } from './getContentCard';

export default ContentCardConnected;
