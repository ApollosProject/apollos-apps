import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import HTMLView from '@apollosproject/ui-htmlview';
import {
  BackgroundView,
  ErrorCard,
  PaddedView,
  ContentTitles,
  ConnectedImage,
  named,
} from '@apollosproject/ui-kit';

import { useLike } from '../LikeButtonConnected';
import { useShare } from '../ShareButtonConnected';

import safeOpenUrl from '../safeOpenUrl';
import GET_CONTENT_ITEM_CONTENT from './getContentNode';

const ComponentPropType = PropTypes.oneOfType([
  PropTypes.node,
  PropTypes.func,
  PropTypes.object, // type check for React fragments
]);

const DefaultHeader = ({ node }) => {
  const [isLiked, like] = useLike(node?.id);
  const share = useShare(node?.id);
  return (
    <BackgroundView flexed={false} material="paper">
      <ContentTitles
        {...node}
        featured
        isLiked={isLiked}
        onPressLike={like}
        onPressShare={share}
      />
    </BackgroundView>
  );
};

DefaultHeader.propTypes = {
  node: PropTypes.shape({ id: PropTypes.string }),
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
  const { data: { node } = {}, loading, error } = useQuery(
    GET_CONTENT_ITEM_CONTENT,
    {
      variables: { nodeId },
      fetchPolicy: 'cache-first',
    }
  );
  if (!nodeId) return <HTMLView isLoading />;

  if (!node?.htmlContent && error) return <ErrorCard error={error} />;

  const coverImageSources = node?.coverImage?.sources || [];
  return (
    <>
      {coverImageSources.length || loading ? (
        <ImageWrapperComponent>
          <ConnectedImage
            maintainAspectRatio
            isLoading={!coverImageSources.length && loading}
            source={coverImageSources}
          />
        </ImageWrapperComponent>
      ) : null}
      <HeaderComponent isLoading={!node?.title && loading} node={node} />
      <BackgroundView flex={false}>
        <PaddedView>
          <HtmlComponent
            isLoading={!node?.htmlContent && loading}
            onPressAnchor={onPressAnchor}
            node={node}
          />
        </PaddedView>
      </BackgroundView>
    </>
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
