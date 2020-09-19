import React from 'react';
import PropTypes from 'prop-types';

import { get } from 'lodash';
import { ThemeMixin } from '@apollosproject/ui-kit';
import { Query } from 'react-apollo';
import GET_NODE_THEME from './getNodeTheme';

const ThemeMixinConnected = ({ nodeId, ...props }) => (
  <Query query={GET_NODE_THEME} variables={{ nodeId }}>
    {({ data }) => (
      <ThemeMixin
        mixin={{
          ...get(data, 'node.theme'),
        }}
        {...props}
      />
    )}
  </Query>
);

ThemeMixinConnected.propTypes = {
  nodeId: PropTypes.string,
};

export { ThemeMixinConnected as default, GET_NODE_THEME };
