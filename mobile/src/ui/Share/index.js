import React from 'react';
// import { Share } from 'react-native';
import PropTypes from 'prop-types';
import Icon from '/mobile/ui/Icon';
import Touchable from '/mobile/ui/Touchable';
import share from '/mobile/utils/content/share';

// const shareSomething = (content) => {
//   Share.share({
//     message: content.message,
//     title: content.title,
//     url: content.url,
//   });
// };

const Share = ({ content }) => (
  <Touchable onPress={() => share(content)}>
    <Icon name={'share'} />
  </Touchable>
);

Share.propTypes = {
  content: PropTypes.shape({
    message: PropTypes.string,
    title: PropTypes.string,
    url: PropTypes.string,
  }),
};

export default Share;
