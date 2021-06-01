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

const DefaultHeader = ({ isLoading, node }) => (
  <H2 padded isLoading={isLoading}>
    {node?.title}
  </H2>
);

DefaultHeader.propTypes = {
  node: PropTypes.shape({ title: PropTypes.string }),
  isLoading: PropTypes.bool,
};

const DefaultHTML = ({ isLoading, onPressAnchor, node }) => (
  <HTMLView isLoading={isLoading} onPressAnchor={onPressAnchor}>
    {node?.htmlContent}
  </HTMLView>
);

DefaultHTML.propTypes = {
  node: PropTypes.shape({ htmlContent: PropTypes.string }),
  onPressAnchor: PropTypes.func,
  isLoading: PropTypes.bool,
};

const ContentNodeConnected = ({
  HeaderComponent,
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
      {({ data: { node } = {}, loading, error }) => {
        if (!node?.htmlContent && error) return <ErrorCard error={error} />;

        const coverImageSources = node?.coverImage?.sources || [];
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
              <HeaderComponent
                isLoading={!node?.title && loading}
                node={node}
              />
              <HtmlComponent
                isLoading={!node?.htmlContent && loading}
                onPressAnchor={onPressAnchor}
                node={node}
              />
            </PaddedView>
          </>
        );
      }}
    </Query>
  );
};

ContentNodeConnected.propTypes = {
  nodeId: PropTypes.string.isRequired,
  HeaderComponent: ComponentPropType,
  HtmlComponent: ComponentPropType,
  ImageWrapperComponent: ComponentPropType,
  onPressAnchor: PropTypes.func,
};

ContentNodeConnected.defaultProps = {
  HeaderComponent: DefaultHeader,
  HtmlComponent: DefaultHTML,
  ImageWrapperComponent: View,
  onPressAnchor: safeOpenUrl,
};

export default named('ui-connected.ContentNodeConnected')(ContentNodeConnected);
