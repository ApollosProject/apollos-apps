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
              onPress={navigationState.route.jumpTo} // eslint-disable-line react/jsx-handler-names
            />
          ) : null}
          <HTMLView>{body}</HTMLView>
        </View>
      </Placeholder.Paragraph>
    </ContentContainer>
  </ScrollView>
);

ContentTab.propTypes = {
  /** The devotional text */
  body: PropTypes.string,
  /** Toggles placeholders */
  isLoading: PropTypes.bool,
  /**
   * The state of the TabView component (of which the ContentTab is one child component). Mostly used
   * for the ScriptureList component to be able to jump to the ScriptureTab when the scripture
   * reference link is tapped.
   */
  navigationState: PropTypes.shape({ routes: PropTypes.array }),
  /** An array of scripture objects */
  scripture: PropTypes.arrayOf(
    PropTypes.shape({
      /** The ID of the verse (i.e. '1CO.15.57') */
      id: PropTypes.string,
      /** A human readable reference (i.e. '1 Corinthians 15:57') */
      reference: PropTypes.string,
      /** The scripture source to render */
      html: PropTypes.string,
    })
  ),
  /** The devotional title */
  title: PropTypes.string,
};

export default ContentTab;
