import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { compose } from 'recompose';
import Placeholder from 'rn-placeholder';

import { H4, H6 } from 'apolloschurchapp/src/ui/typography';
import { withIsLoading } from 'apolloschurchapp/src/ui/isLoading';

import ScriptureHTMLView from './ScriptureHTMLView';

const enhance = compose(withIsLoading);

const Item = enhance(({ reference, isLoading }) => (
  <View>
    <H4>
      {' '}
      {/* wrapping text element provides unified baseline */}
      <H4>{reference.query}</H4> <H6>ESV</H6>
    </H4>
    <Placeholder.Paragraph
      lineNumber={5}
      onReady={!isLoading}
      lastLineWidth="60%"
      firstLineWidth="40%"
    >
      <ScriptureHTMLView>{reference.passage}</ScriptureHTMLView>
    </Placeholder.Paragraph>
  </View>
));

Item.propTypes = {
  reference: PropTypes.shape({
    query: PropTypes.string,
    passages: PropTypes.string,
  }),
};

export default Item;
