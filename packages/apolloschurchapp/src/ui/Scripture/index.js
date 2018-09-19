import React from 'react';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import Spacer from 'apolloschurchapp/src/ui/Spacer';

import Item from './Item';
import getScripture from './getScripture';

export const ScriptureList = ({ scripture, commas = true }) => {
    if (!scripture && commas) return '';
    if (!scripture) return [];

    const combo = scripture.map(({ reference }) => `${reference}`);

    if (commas) return combo.join(', ');
    return combo;
}

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
    <Spacer byHeight />
  </View>
);

Scripture.propTypes = {
  references: PropTypes.arrayOf(PropTypes.string),
};

export default Scripture;
