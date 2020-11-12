import * as campus from './campus';
import * as content from './content';
import * as features from './features';
import * as live from './live';
import * as pass from './pass';
import * as scripture from './scripture';
import * as user from './user';
import * as interfaces from './interfaces';
import * as searchResults from './searchResults';

const FRAGMENTS = {
  ...campus,
  ...content,
  ...features,
  ...live,
  ...scripture,
  ...pass,
  ...user,
  ...interfaces,
  ...searchResults,
};

export default FRAGMENTS;
