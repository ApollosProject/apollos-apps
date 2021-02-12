import React from 'react';
import {
  Button,
  styled,
  H4,
  withTheme,
  Icon,
  named,
} from '@apollosproject/ui-kit';
import { Query } from '@apollo/client/react/components';
import { get } from 'lodash';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import nodeImplementsType from '../utils/nodeImplementsType';
import GET_CONTENT_UP_NEXT from './getContentUpNext';

const UpNextButton = styled(
  ({
    theme: {
      sizing: { baseUnit },
    },
  }) => ({
    marginHorizontal: baseUnit,
  }),
  'ui-connected.UpNextButtonConnected.UpNextButton'
)(Button);

const DoneTextIcon = withTheme(
  ({
    theme: {
      sizing: { baseUnit },
    },
  }) => ({
    size: baseUnit * 1.25,
    name: 'check',
    marginRight: baseUnit / 2,
  }),
  'ui-connected.UpNextButtonConnected.DoneTextIcon'
)(Icon);

const UpNextButtonConnected = ({
  continueText,
  doneText,
  Component,
  contentId,
  nodeId, // You can pass either nodeId or contentId.
}) => {
  const navigation = useNavigation();
  const loadingEnabled =
    nodeId && nodeImplementsType(nodeId, 'ContentParentNode');

  // We want to avoid rendering the Query component if we don't have the ID.
  // Running the query without a contentId throws an error, and the query won't rerun.
  if (!contentId && !nodeId) {
    if (!loadingEnabled) return null;
    return <Component loading />;
  }
  return (
    <Query
      query={GET_CONTENT_UP_NEXT}
      fetchPolicy="cache-and-network"
      variables={{ nodeId: nodeId || contentId }}
    >
      {({ data, loading }) => {
        const upNextId = get(data, 'node.upNext.id');
        const finishedSeries = !upNextId;
        const childContentItemsConnection = get(
          data,
          'node.childContentItemsConnection.edges',
          []
        );
        // We shouldn't show the button if the content doesn't support it.
        // The button is considered "supported" if it's a series (has children) or has an up next Id.
        if (
          (!loadingEnabled && loading) ||
          (!loading && childContentItemsConnection.length === 0 && !upNextId)
        ) {
          return null;
        }
        return (
          <Component
            loading={loadingEnabled && loading}
            disabled={finishedSeries}
            onPress={
              !finishedSeries && !loading
                ? () => navigation.push('ContentSingle', { itemId: upNextId })
                : null
            }
          >
            {!finishedSeries ? continueText : doneText}
          </Component>
        );
      }}
    </Query>
  );
};

UpNextButtonConnected.propTypes = {
  continueText: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.func,
  ]),
  doneText: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.func,
  ]),
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.func,
  ]),
  contentId: PropTypes.string,
  nodeId: PropTypes.string,
};

UpNextButtonConnected.defaultProps = {
  continueText: <H4>{'Continue'}</H4>,
  doneText: (
    <>
      <DoneTextIcon />
      <H4>{"You're all caught up!"}</H4>
    </>
  ),
  Component: UpNextButton,
};

export default named('ui-connected.UpNextButtonConnected')(
  UpNextButtonConnected
);
