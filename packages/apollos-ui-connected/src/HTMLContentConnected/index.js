import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import InAppBrowser from 'react-native-inappbrowser-reborn';

import HTMLView from '@apollosproject/ui-htmlview';
import { ErrorCard } from '@apollosproject/ui-kit';

import GET_CONTENT_ITEM_CONTENT from './getContentItemContent';

function handlePressAnchor(url) {
  return InAppBrowser.open(url);
}

const HTMLContentConnected = ({ Component, contentId }) => {
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
            onPressAnchor={handlePressAnchor}
          >
            {htmlContent}
          </Component>
        );
      }}
    </Query>
  );
};

HTMLContentConnected.propTypes = {
  Component: HTMLView,
  contentId: PropTypes.string,
};

export default HTMLContentConnected;
