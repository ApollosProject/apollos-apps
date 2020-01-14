import * as content from './content';
import * as features from './features';
import * as live from './live';
import * as pass from './pass';
import * as scripture from './scripture';
import * as user from './user';

const FRAGMENTS = {
  ...content,
  ...features,
  ...live,
  ...scripture,
  ...pass,
  ...user,
};

export default FRAGMENTS;
