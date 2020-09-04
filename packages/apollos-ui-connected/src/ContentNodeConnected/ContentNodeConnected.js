import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import HTMLView from '@apollosproject/ui-htmlview';
import {
  ErrorCard,
  PaddedView,
  H2,
  GradientOverlayImage,
  styled,
} from '@apollosproject/ui-kit';

import MediaControlsConnected from '../MediaControlsConnected';
import safeOpenUrl from '../safeOpenUrl';
import GET_CONTENT_ITEM_CONTENT from './getContentNode';

const StyledMediaControlsConnected = styled(
  ({ theme }) => ({
    marginTop: -(theme.sizing.baseUnit * 2.5),
  }),
  'ui-connected.ContentNodeConnected.MediaControlsConnected'
)(MediaControlsConnected);

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
  MediaControlsComponent,
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
            <MediaControlsComponent nodeId={nodeId} />
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
  MediaControlsComponent: ComponentPropType,
  onPressAnchor: PropTypes.func,
};

ContentNodeConnected.defaultProps = {
  HtmlComponent: HTMLView,
  ImageWrapperComponent: View,
  MediaControlsComponent: StyledMediaControlsConnected,
  onPressAnchor: safeOpenUrl,
};

export default ContentNodeConnected;
