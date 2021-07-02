import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import ContentCard from './index';

storiesOf('ui-kit/ContentCard', module).add('(deprecated)', () => (
  <ContentCard title="This component is deprecated" />
));
