// This is the data-bound "connected" scripture component.
// This should pull from a query.
import React from 'react';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import ScriptureItem from 'apolloschurchapp/src/ui/Scripture/ScriptureItem';
import getScripture from './getScripture';

const ScriptureConnected = ({ references }) => (
  <View>
    {references.map((query) => (
      <Query query={getScripture} variables={{ query }} key={query}>
        {({ loading, data }) => (
          <ScriptureItem
            reference={get(data, 'scripture.reference', '')}
            html={get(data, 'scripture.html', '')}
            isLoading={loading}
          />
        )}
      </Query>
    ))}
  </View>
);

ScriptureConnected.propTypes = {
  references: PropTypes.arrayOf(PropTypes.string),
};

export default ScriptureConnected;
