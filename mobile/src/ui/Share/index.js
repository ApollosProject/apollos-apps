import React from 'react';
import PropTypes from 'prop-types';
import Icon from '/mobile/ui/Icon';
import Touchable from '/mobile/ui/Touchable';
import share from '/mobile/utils/content/share';

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
