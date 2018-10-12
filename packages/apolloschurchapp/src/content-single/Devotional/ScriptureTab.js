import React from 'react';
import { ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import PaddedView from 'apolloschurchapp/src/ui/PaddedView';
import ScriptureItem from 'apolloschurchapp/src/ui/Scripture';
import styled from 'apolloschurchapp/src/ui/styled';
import HorizontalTileFeed from 'apolloschurchapp/src/ui/HorizontalTileFeed';

const FeedContainer = styled({
  paddingHorizontal: 0,
})(PaddedView);

/**
 * This is the Scripture side of the Devotional tabbed component.
 * Maps over an array of scripture references and renders them
 * using the ScriptureItem component.
 */
const ScriptureTab = ({
  scripture,
  isLoading,
  horizontalContent,
  loadingStateObject,
  renderItem,
}) => (
  <ScrollView>
    <PaddedView>
      {scripture.map((ref) => (
        <ScriptureItem
          key={ref.id}
          reference={ref.reference}
          html={ref.html}
          isLoading={isLoading}
        />
      ))}
    </PaddedView>
    {(horizontalContent && horizontalContent.length) || isLoading ? (
      <FeedContainer>
        <HorizontalTileFeed
          content={horizontalContent}
          isLoading={isLoading}
          loadingStateObject={loadingStateObject}
          renderItem={renderItem}
        />
      </FeedContainer>
    ) : null}
  </ScrollView>
);

ScriptureTab.propTypes = {
  /** Toggles placeholders */
  isLoading: PropTypes.bool,
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
  /** An array of parent/sibling content to display under the tabs */
  horizontalContent: PropTypes.array, // eslint-disable-line
  /** An object with fake data to display while the data is loading. */
  loadingStateObject: PropTypes.shape({}).isRequired,
  /** A function that holds the components to display the horizontal content */
  renderItem: PropTypes.func.isRequired,
};

export default ScriptureTab;
