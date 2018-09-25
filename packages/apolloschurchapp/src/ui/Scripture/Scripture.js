import React from 'react';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import Item from './Item';
import getScripture from './getScripture';

const Scripture = ({ references = [] }) => (
  <View>
    {references.map((query) => (
      <Query query={getScripture} variables={{ query }} key={query}>
        {({ loading, data }) => (
          <Item
            reference={get(data, 'scripture.reference', '')}
            html={get(data, 'scripture.html', '')}
            isLoading={loading}
          />
        )}
      </Query>
    ))}
  </View>
);

Scripture.propTypes = {
  references: PropTypes.arrayOf(PropTypes.string),
};

export default Scripture;
