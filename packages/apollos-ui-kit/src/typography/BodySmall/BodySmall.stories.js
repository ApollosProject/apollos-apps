import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@apollosproject/ui-storybook';

import CenteredView from '../../CenteredView';
import PaddedView from '../../PaddedView';

import BodySmall from '.';

storiesOf('ui-kit/typography/BodySmall', module)
  .addDecorator((story) => (
    <CenteredView>
      <PaddedView>{story()}</PaddedView>
    </CenteredView>
  ))
  .add('Regular', () => (
    <BodySmall>
      {
        '"True faith means holding nothing back. It means putting every hope in God\'s fidelity to His Promises." ― Francis Chan'
      }
    </BodySmall>
  ))
  .add('Bold', () => (
    <BodySmall bold>
      {
        '"True faith means holding nothing back. It means putting every hope in God\'s fidelity to His Promises." ― Francis Chan'
      }
    </BodySmall>
  ))
  .add('Italic', () => (
    <BodySmall italic>
      {
        '"True faith means holding nothing back. It means putting every hope in God\'s fidelity to His Promises." ― Francis Chan'
      }
    </BodySmall>
  ))
  .add('Bold Italic', () => (
    <BodySmall bold italic>
      {
        '"True faith means holding nothing back. It means putting every hope in God\'s fidelity to His Promises." ― Francis Chan'
      }
    </BodySmall>
  ))
  .add('isLoading', () => (
    <BodySmall isLoading>
      {
        '"True faith means holding nothing back. It means putting every hope in God\'s fidelity to His Promises." ― Francis Chan'
      }
    </BodySmall>
  ))
  .add('Border Box – platform testing', () => {
    const border = { borderWidth: 1, borderStyle: 'solid' };

    return (
      <View>
        <BodySmall style={border}>Body Text</BodySmall>
        <BodySmall style={border}>
          {
            '"True faith means holding nothing\nback. It means putting every\nhope in God\'s fidelity to His Promises." ― Francis Chan'
          }
        </BodySmall>
      </View>
    );
  });
