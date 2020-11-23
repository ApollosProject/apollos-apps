import PropTypes from 'prop-types';

import PlayButton from './PlayButton';

const PlayButtonConnected = () =>
  console.warn('PlayButtonConnected is deprecated') || null;

PlayButtonConnected.propTypes = {
  coverImageSources: PropTypes.arrayOf(PropTypes.shape({})),
  isVideo: PropTypes.bool,
  parentChannelName: PropTypes.string,
  title: PropTypes.string,
  videoSource: PropTypes.shape({}),
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object, // type check for React fragments
  ]),
};

PlayButtonConnected.defaultProps = {
  isVideo: true,
  Component: PlayButton,
};

export default PlayButtonConnected;
