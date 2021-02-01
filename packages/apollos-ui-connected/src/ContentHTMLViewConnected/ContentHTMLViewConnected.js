import React from 'react';
import PropTypes from 'prop-types';
import { Query } from '@apollo/client/react/components';
import HTMLView from '@apollosproject/ui-htmlview';
import { ErrorCard, named } from '@apollosproject/ui-kit';

import safeOpenUrl from '../safeOpenUrl';
import GET_CONTENT_ITEM_CONTENT from './getContentItemContent';

const ContentHTMLViewConnected = ({ Component, contentId, onPressAnchor }) => {
  if (!contentId) return <HTMLView isLoading />;

  return (
    <Query
      query={GET_CONTENT_ITEM_CONTENT}
      variables={{ contentId }}
      fetchPolicy={'cache-and-network'}
    >
      {({ data: { node: { htmlContent } = {} } = {}, loading, error }) => {
        if (!htmlContent && error) return <ErrorCard error={error} />;
        return (
          <Component
            isLoading={!htmlContent && loading}
            onPressAnchor={onPressAnchor}
          >
            {htmlContent}
          </Component>
        );
      }}
    </Query>
  );
};

ContentHTMLViewConnected.propTypes = {
  contentId: PropTypes.string.isRequired,
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object, // type check for React fragments
  ]),
  onPressAnchor: PropTypes.func,
};

ContentHTMLViewConnected.defaultProps = {
  Component: HTMLView,
  onPressAnchor: safeOpenUrl,
};

export default named('ui-connected.ContentHTMLViewConnected')(
  ContentHTMLViewConnected
);
