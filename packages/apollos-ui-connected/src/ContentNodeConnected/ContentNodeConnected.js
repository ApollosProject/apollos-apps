import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Query } from '@apollo/client/react/components';
import HTMLView from '@apollosproject/ui-htmlview';
import {
  ErrorCard,
  PaddedView,
  H2,
  GradientOverlayImage,
  named,
} from '@apollosproject/ui-kit';

import safeOpenUrl from '../safeOpenUrl';
import GET_CONTENT_ITEM_CONTENT from './getContentNode';

const ComponentPropType = PropTypes.oneOfType([
  PropTypes.node,
  PropTypes.func,
  PropTypes.object, // type check for React fragments
]);

const ContentNodeConnected = ({
  HtmlComponent,
  nodeId,
  onPressAnchor,
  ImageWrapperComponent,
}) => {
  if (!nodeId) return <HTMLView isLoading />;
  return (
    <Query
      query={GET_CONTENT_ITEM_CONTENT}
      variables={{ nodeId }}
      fetchPolicy={'cache-and-network'}
    >
      {({
        data: { node: { htmlContent, title, coverImage } = {} } = {},
        loading,
        error,
      }) => {
        if (!htmlContent && error) return <ErrorCard error={error} />;
        const coverImageSources = coverImage?.sources || [];
        return (
          <>
            {coverImageSources.length || loading ? (
              <ImageWrapperComponent>
                <GradientOverlayImage
                  isLoading={!coverImageSources.length && loading}
                  source={coverImageSources}
                />
              </ImageWrapperComponent>
            ) : null}

            {/* fixes text/navigation spacing by adding vertical padding if we dont have an image */}
            <PaddedView vertical={!coverImageSources.length}>
              <H2 padded isLoading={!title && loading}>
                {title}
              </H2>
              <HtmlComponent
                isLoading={!htmlContent && loading}
                onPressAnchor={onPressAnchor}
              >
                {htmlContent}
              </HtmlComponent>
            </PaddedView>
          </>
        );
      }}
    </Query>
  );
};

ContentNodeConnected.propTypes = {
  nodeId: PropTypes.string.isRequired,
  HtmlComponent: ComponentPropType,
  ImageWrapperComponent: ComponentPropType,
  onPressAnchor: PropTypes.func,
};

ContentNodeConnected.defaultProps = {
  HtmlComponent: HTMLView,
  ImageWrapperComponent: View,
  onPressAnchor: safeOpenUrl,
};

export default named('ui-connected.ContentNodeConnected')(ContentNodeConnected);
