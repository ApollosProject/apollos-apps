import React from 'react';
import PropTypes from 'prop-types';
import { Linking } from 'react-native';
import { Button, PaddedView } from '@apollosproject/ui-kit';

const ButtonFeature = ({ action }) => (
  <PaddedView>
    <Button
      title={action?.title || 'Go!'}
      onPress={() => Linking.openURL(action.relatedNode.url)}
    />
  </PaddedView>
);

ButtonFeature.propTypes = {
  action: PropTypes.shape({
    title: PropTypes.string,
    relatedNode: PropTypes.shape({ url: PropTypes.string }),
  }),
};

export default ButtonFeature;
