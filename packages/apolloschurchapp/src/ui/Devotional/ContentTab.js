import React from 'react';
import { ScrollView, View } from 'react-native';
import PropTypes from 'prop-types';
import PaddedView from 'apolloschurchapp/src/ui/PaddedView';
import { H2 } from 'apolloschurchapp/src/ui/typography';
import styled from 'apolloschurchapp/src/ui/styled';
import HTMLView from 'apolloschurchapp/src/ui/HTMLView';
import { ScriptureList } from 'apolloschurchapp/src/ui/Scripture';
import Placeholder from 'apolloschurchapp/src/ui/Placeholder';

const ContentContainer = styled({ paddingVertical: 0 })(PaddedView);

/**
 * This is the Content side of the Devotional tabbed component.
 * Displays a header, scripture list (using the ScriptureList component),
 * and the body text of the devo.
 */
const ContentTab = ({ title, scripture, body, isLoading, navigationState }) => (
  <ScrollView>
    <ContentContainer>
      <Placeholder.Paragraph
        lineNumber={15}
        onReady={!isLoading}
        lastLineWidth="60%"
        firstLineWidth="40%"
      >
        <View>
          <H2 padded>{title}</H2>
          {scripture && scripture.length ? (
            <ScriptureList
              scripture={scripture}
              jumpTo={navigationState.route.jumpTo}
            />
          ) : null}
          <HTMLView>{body}</HTMLView>
        </View>
      </Placeholder.Paragraph>
    </ContentContainer>
  </ScrollView>
);

/**
 * Props passed to the ContentTab component:
 * body: body text of the devotional.
 * isLoading: prop used to display a placeholder while data is loading.
 * navigationState: state of the TabView component (of which the ContentTab
 * is one child component). Mostly used for the ScriptureList component to be
 * able to jump to the ScriptureTab when the scripture reference link is tapped.
 * scripture: An array of scripture verses containing:
 *   id: The ID of the verse (i.e. '1CO.15.57')
 *   reference: The scripture location (i.e. '1 Corinthians 15:57')
 *   html: The HTML of the verses to render.
 * title: The title of the devotional.
 */
ContentTab.propTypes = {
  body: PropTypes.string,
  isLoading: PropTypes.bool,
  navigationState: PropTypes.shape({ routes: PropTypes.array }),
  scripture: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      reference: PropTypes.string,
      html: PropTypes.string,
    })
  ),
  title: PropTypes.string,
};

export default ContentTab;
