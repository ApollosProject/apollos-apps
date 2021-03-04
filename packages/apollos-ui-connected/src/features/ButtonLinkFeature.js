import React from 'react';
import PropTypes from 'prop-types';
import { Linking } from 'react-native';
import { Button } from '@apollosproject/ui-kit';

const ButtonLinkFeature = ({ title, url }) => (
  <Button title={title} onPress={() => Linking.openURL(url)} />
);

ButtonLinkFeature.propTypes = {
  title: PropTypes.string,
  url: PropTypes.string,
};

export default ButtonLinkFeature;
