import React from 'react';

import { named } from '../theme';

import DefaultCard from '../DefaultCard';

const FeaturedCard = (props) => <DefaultCard featured {...props} />;

export default named('ui-kit.FeaturedCard')(FeaturedCard);
