import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { styled, Placeholder, H4, H6 } from '@apollosproject/ui-kit';

import { LegalText } from './typography';
import ScriptureHTMLView from './ScriptureHTMLView';

const Reference = styled(
  ({ theme }) => ({
    paddingBottom: theme.helpers.verticalRhythm(0.5),
  }),
  'ui-scripture.Scripture.ScriptureItem.Reference'
)(H4);

const ScriptureItem = ({ reference, html, copyright, isLoading, version }) => (
  <Placeholder.Paragraph
    lineNumber={5}
    onReady={!isLoading}
    lastLineWidth={'60%'}
    firstLineWidth={'40%'}
  >
    <View>
      <Reference>
        <H4>{reference}</H4>
        {version ? <H6> {version}</H6> : null}
      </Reference>
      <ScriptureHTMLView>{html}</ScriptureHTMLView>
      {copyright === 'PUBLIC DOMAIN' ? null : (
        <LegalText>{copyright}</LegalText>
      )}
    </View>
  </Placeholder.Paragraph>
);

ScriptureItem.propTypes = {
  reference: PropTypes.string,
  html: PropTypes.string,
  version: PropTypes.string,
  copyright: PropTypes.string,
  isLoading: PropTypes.bool,
};

export default ScriptureItem;
