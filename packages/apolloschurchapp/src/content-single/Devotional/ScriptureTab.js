import React from 'react';
import { ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import PaddedView from 'apolloschurchapp/src/ui/PaddedView';
import ScriptureItem from 'apolloschurchapp/src/ui/Scripture';

/**
 * This is the Scripture side of the Devotional tabbed component.
 * Maps over an array of scripture references and renders them
 * using the ScriptureItem component.
 */
const ScriptureTab = ({ scripture, isLoading }) => (
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
  </ScrollView>
);

/**
 * Props passed to the ScriptureTab component:
 * scripture: An array of scripture verses containing:
 *   id: The ID of the verse (i.e. '1CO.15.57')
 *   reference: The scripture location (i.e. '1 Corinthians 15:57')
 *   html: The HTML of the verses to render.
 * isLoading: A self-explanatory prop letting the component know whether
 * or not it is still loading.
 */
ScriptureTab.propTypes = {
  scripture: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      reference: PropTypes.string,
      html: PropTypes.string,
    })
  ),
  isLoading: PropTypes.bool,
};

export default ScriptureTab;
