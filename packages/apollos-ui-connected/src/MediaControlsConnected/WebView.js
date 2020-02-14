import React from 'react';
import PropTypes from 'prop-types';

import RockAuthedWebBrowser from '../RockAuthedWebBrowser';

import { PlayButton } from './PlayButtonConnected';

const WebView = ({ webViewUrl, coverImageSources, style, ...props }) => (
  <RockAuthedWebBrowser {...props}>
    {(openUrl) => (
      <PlayButton
        onPress={() => openUrl(webViewUrl)}
        coverImageSources={coverImageSources}
        style={style}
      />
    )}
  </RockAuthedWebBrowser>
);

WebView.propTypes = {
  webViewUrl: PropTypes.string,
  coverImageSources: PropTypes.arrayOf(PropTypes.shape({})),
  style: PropTypes.any, // eslint-disable-line
};

export default WebView;
