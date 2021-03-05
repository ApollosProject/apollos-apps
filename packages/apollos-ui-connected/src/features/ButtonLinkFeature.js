import React from 'react';
import PropTypes from 'prop-types';
import { Linking } from 'react-native';
import { Button, PaddedView } from '@apollosproject/ui-kit';

const ButtonLinkFeature = ({ title, url }) => (
  <PaddedView>
    <Button title={title} onPress={() => Linking.openURL(url)} />
  </PaddedView>
);

ButtonLinkFeature.propTypes = {
  title: PropTypes.string,
  url: PropTypes.string,
};

export default ButtonLinkFeature;
