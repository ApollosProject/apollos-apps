import React from 'react';
import PropTypes from 'prop-types';

import RockAuthedWebBrowser from '../RockAuthedWebBrowser';

import { PlayButton } from './PlayButtonConnected';

const WebView = ({ webViewUrl, coverImageSources }) => (
  <RockAuthedWebBrowser>
    {(openUrl) => (
      <PlayButton
        onPress={() => openUrl(webViewUrl)}
        coverImageSources={coverImageSources}
      />
    )}
  </RockAuthedWebBrowser>
);

WebView.propTypes = {
  webViewUrl: PropTypes.string,
  coverImageSources: PropTypes.arrayOf(PropTypes.shape({})),
};

export default WebView;
