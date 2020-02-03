import React from 'react';
import PropTypes from 'prop-types';

import RockAuthedWebBrowser from '../RockAuthedWebBrowser';

import PlayButton from './PlayButton';

const WebView = ({ webViewUrl, coverImageSources }) => (
  <RockAuthedWebBrowser>
    {(openUrl) => (
      <PlayButton
        action={() => openUrl(webViewUrl)}
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
