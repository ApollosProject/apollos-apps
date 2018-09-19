import React from 'react';
import { ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import PaddedView from 'apolloschurchapp/src/ui/PaddedView';
import Scripture from 'apolloschurchapp/src/ui/Scripture';

const ScriptureTab = ({ scripture }) => (
  <ScrollView>
    <PaddedView>
      <Scripture references={scripture} />
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
};

export default ScriptureTab;
