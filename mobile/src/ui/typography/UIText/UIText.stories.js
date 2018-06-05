import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';

import UIText from './';

storiesOf('typography/UIText', module)
  .add('Normal', () => (
    <UIText>
      {
        '"True faith means holding nothing back. It means putting every hope in God\'s fidelity to His Promises." ― Francis Chan'
      }
    </UIText>
  ))
  .add('Bold', () => (
    <UIText bold>
      {
        '"True faith means holding nothing back. It means putting every hope in God\'s fidelity to His Promises." ― Francis Chan'
      }
    </UIText>
  ))
  .add('Italic', () => (
    <UIText italic>
      {
        '"True faith means holding nothing back. It means putting every hope in God\'s fidelity to His Promises." ― Francis Chan'
      }
    </UIText>
  ))
  .add('Bold Italic', () => (
    <UIText bold italic>
      {
        '"True faith means holding nothing back. It means putting every hope in God\'s fidelity to His Promises." ― Francis Chan'
      }
    </UIText>
  ))
  .add('isLoading', () => (
    <UIText isLoading>
      {
        '"True faith means holding nothing back. It means putting every hope in God\'s fidelity to His Promises." ― Francis Chan'
      }
    </UIText>
  ))
  .add('Border Box – platform testing', () => {
    const border = { borderWidth: 1, borderStyle: 'solid' };

    return (
      <View>
        <UIText style={border}>Body Text</UIText>
        <UIText style={border}>
          {
            '"True faith means holding nothing\nback. It means putting every\nhope in God\'s fidelity to His Promises." ― Francis Chan'
          }
        </UIText>
      </View>
    );
  });
