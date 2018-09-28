import React from 'react';
import { ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import PaddedView from 'apolloschurchapp/src/ui/PaddedView';
import ScriptureItem from 'apolloschurchapp/src/ui/Scripture';

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
