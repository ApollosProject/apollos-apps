import React from 'react';
import { ScrollView } from 'react-native';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import styled from 'apolloschurchapp/src/ui/styled';
import GradientOverlayImage from 'apolloschurchapp/src/ui/GradientOverlayImage';
import BackgroundView from 'apolloschurchapp/src/ui/BackgroundView';
import PaddedView from 'apolloschurchapp/src/ui/PaddedView';
import { H2 } from 'apolloschurchapp/src/ui/typography';
import Devotional from '../Devotional';
import MediaControls from '../MediaControls';
import HTMLContent from '../HTMLContent';
import HorizontalContentFeed from '../HorizontalContentFeed';

const FlexedScrollView = styled({ flex: 1 })(ScrollView);

const RenderContent = ({ content, loading }) => {
  const coverImageSources = get(content, 'coverImage.sources', []);
  if (
    content.__typename === 'DevotionalContentItem' &&
    content.parentChannel &&
    content.parentChannel.name === 'Devotional'
  ) {
    return (
      <Devotional
        id={content.id}
        body={content.htmlContent}
        title={content.title}
        isLoading={loading}
        scripture={content.scriptures || []}
      />
    );
  }
  return (
    <FlexedScrollView>
      {coverImageSources.length || loading ? (
        <GradientOverlayImage
          isLoading={!coverImageSources.length && loading}
          source={coverImageSources}
        />
      ) : null}
      <BackgroundView>
        <MediaControls contentId={content.id} />
        <PaddedView>
          <H2 padded isLoading={!content.title && loading}>
            {content.title}
          </H2>
          <HTMLContent contentId={content.id} />
        </PaddedView>
        <HorizontalContentFeed contentId={content.id} />
      </BackgroundView>
    </FlexedScrollView>
  );
};

RenderContent.propTypes = {
  content: PropTypes.shape({
    __typename: PropTypes.string,
    parentChannel: PropTypes.shape({
      name: PropTypes.string,
    }),
    id: PropTypes.string,
    htmlContent: PropTypes.string,
    title: PropTypes.string,
    scriptures: PropTypes.arrayOf(
      PropTypes.shape({
        /** The ID of the verse (i.e. '1CO.15.57') */
        id: PropTypes.string,
        /** A human readable reference (i.e. '1 Corinthians 15:57') */
        reference: PropTypes.string,
        /** The scripture source to render */
        html: PropTypes.string,
      })
    ),
  }),
  loading: PropTypes.bool,
};

export default RenderContent;
