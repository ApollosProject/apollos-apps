import React from 'react';
import { gql, useQuery } from '@apollo/client';
import PropTypes from 'prop-types';

import { TrackEventWhenLoaded } from '@apollosproject/ui-analytics';
import { styled, named } from '@apollosproject/ui-kit';

import InteractWhenLoadedConnected from '../InteractWhenLoadedConnected';
import NodeSingleConnected from '../NodeSingleConnected';
import ThemeMixinConnected from '../ThemeMixinConnected';

const PaddedNodeSingleConnected = styled(({ theme: { sizing } }) => ({
  paddingBottom: sizing.baseUnit * 5,
}))(NodeSingleConnected);

const ContentSingle = (props) => {
  const nodeId = props.route?.params?.itemId;
  const { data, loading } = useQuery(
    gql`
      query getContentNodeTitle($nodeId: ID!) {
        node(id: $nodeId) {
          id
          ... on ContentNode {
            title
          }
        }
      }
    `,
    { variables: { nodeId } }
  );
  return (
    <ThemeMixinConnected nodeId={nodeId}>
      {props.autoComplete ? (
        <InteractWhenLoadedConnected
          isLoading={loading}
          nodeId={nodeId}
          action={'COMPLETE'}
        />
      ) : null}
      <TrackEventWhenLoaded
        isLoading={loading}
        eventName={'View Content'}
        properties={{
          title: data?.node?.title,
          itemId: nodeId,
          parentId: data?.node?.parentChannel?.id,
          parentName: data?.node?.parentChannel?.name,
        }}
      />
      <PaddedNodeSingleConnected nodeId={nodeId} />
    </ThemeMixinConnected>
  );
};

ContentSingle.propTypes = {
  navigation: PropTypes.shape({
    push: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      itemId: PropTypes.string,
    }),
  }),
  autoComplete: PropTypes.bool,
};

ContentSingle.defaultProps = {
  autoComplete: true,
};

export default named('ContentSingle')(ContentSingle);
