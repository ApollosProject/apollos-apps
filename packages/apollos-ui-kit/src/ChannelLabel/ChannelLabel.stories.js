import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@apollosproject/ui-storybook';

import CenteredView from '../CenteredView';
import BackgroundView from '../BackgroundView';
import styled from '../styled';

import ChannelLabel from '.';

storiesOf('ui-kit/ChannelLabel', module)
  .addDecorator((getStory) => (
    <BackgroundView>
      <CenteredView>{getStory()}</CenteredView>
    </BackgroundView>
  ))
  .add('Default', () => <ChannelLabel label={'Default'} />)
  .add('isLoading', () => <ChannelLabel label={'Default'} isLoading />)
  .add('With Icon', () => <ChannelLabel label={'Albums'} icon={'like-solid'} />)
  .add('isLoading With Icon', () => (
    <ChannelLabel label={'Albums'} icon={'like-solid'} isLoading />
  ))
  .add('withFlex', () => {
    const Wrapper = styled({
      flex: 1,
      width: '100%',
    })(View);

    const Box = styled({
      flex: 3,
      backgroundColor: 'salmon',
    })(View);

    return (
      <Wrapper>
        <ChannelLabel label={'Albums'} icon={'arrow-back'} withFlex />
        <Box />
      </Wrapper>
    );
  });
