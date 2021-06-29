import React from 'react';
import PropTypes from 'prop-types';
import { Query } from '@apollo/client/react/components';
import ScriptureItem from '@apollosproject/ui-scripture';
import { PaddedView, named } from '@apollosproject/ui-kit';
import GET_SCRIPTURE_NODE from './getScriptureNode';

const ScriptureNodeConnected = ({ nodeId }) => {
  if (!nodeId) return <ScriptureItem isLoading />;
  return (
    <Query
      query={GET_SCRIPTURE_NODE}
      variables={{ nodeId }}
      fetchPolicy={'cache-and-network'}
    >
      {({
        data: { node: { scriptures = [] } = { scriptures: [] } } = {},
        loading,
        error,
      }) => {
        // We don't want to show a loading state since this is an optional component.
        // However, if we know there are scriptures (from cached data) we should go ahead and show scripture
        if (!scriptures?.length || (!scriptures?.length && loading) || error) {
          return null;
        }
        return (
          <PaddedView>
            {scriptures.map((ref, i) => (
              <ScriptureItem
                key={ref.id}
                reference={ref.reference}
                html={ref.html}
                copyright={
                  // only show last copyright
                  scriptures.length - 1 === i ? ref.copyright : null
                }
                version={ref.version}
              />
            ))}
          </PaddedView>
        );
      }}
    </Query>
  );
};

ScriptureNodeConnected.propTypes = {
  nodeId: PropTypes.string.isRequired,
};

ScriptureNodeConnected.defaultProps = {};

export default named('ui-connected.ScriptureNodeConnected')(
  ScriptureNodeConnected
);
