import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import InAppBrowser from 'react-native-inappbrowser-reborn';

import HTMLView from '@apollosproject/ui-htmlview';
import { ErrorCard } from '@apollosproject/ui-kit';

import GET_CONTENT_ITEM_CONTENT from './getContentItemContent';

const handleOnPressAnchor = (url) => InAppBrowser.open(url);

const ContentHTMLViewConnected = ({ Component, contentId }) => {
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
            onPressAnchor={handleOnPressAnchor}
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
};

ContentHTMLViewConnected.defaultProps = {
  Component: HTMLView,
};

export default ContentHTMLViewConnected;
