/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import { StyleSheet, View } from 'react-native';

import CenteredView from '../../CenteredView';
import BackgroundView from '../../BackgroundView';
import Button from '../../Button';
import HorizontalDefaultCard from '../../HorizontalDefaultCard';

import FanEffect from '../FanEffect';

const styles = StyleSheet.create({
  square: {
    width: 200,
    height: 200,
    backgroundColor: 'red',
    borderRadius: 20,
    shadowOffset: {
      width: -2,
      height: -2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  centeredView: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const Interactive = ({ children }) => {
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    if (!trigger) {
      setTrigger(true);
    }
  }, [trigger]);

  return (
    <BackgroundView style={styles.centeredView}>
      <CenteredView>{trigger && children}</CenteredView>
      <Button title="Again" onPress={() => setTrigger(false)} />
    </BackgroundView>
  );
};

storiesOf('ui-kit/FanEffect', module).add('Shapes', () => (
  <Interactive>
    <FanEffect>
      <View style={styles.square} />
      <View style={styles.square} />
      <View style={styles.square} />
    </FanEffect>
  </Interactive>
));

storiesOf('ui-kit/FanEffect', module).add('Cards', () => (
  <Interactive>
    <FanEffect>
      <HorizontalDefaultCard
        title="Card Title"
        summary="Wow! What a great animation"
        coverImage="https://source.unsplash.com/random"
      />
      <HorizontalDefaultCard
        title="Card Title"
        summary="Wow! What a great animation"
        coverImage="https://source.unsplash.com/random"
      />
      <HorizontalDefaultCard
        title="Card Title"
        summary="Wow! What a great animation"
        coverImage="https://source.unsplash.com/random"
      />
    </FanEffect>
  </Interactive>
));
