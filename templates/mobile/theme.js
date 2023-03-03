import ApollosConfig from '@apollosproject/config';
import FRAGMENTS from '@apollosproject/ui-fragments';

const THEME = require('./theme.json');

ApollosConfig.loadJs({ FRAGMENTS, THEME });
