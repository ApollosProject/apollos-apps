import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';

import SerifText from '.';

storiesOf('typography/SerifText', module)
  .add('Regular', () => (
    <SerifText>
      {`"God's commands are designed to guide you to life's very best. You will not obey Him, if you do not believe Him and trust Him. You cannot believe Him if you do not love Him. You cannot love Him unless you know Him." ― Henry Blackaby`}
    </SerifText>
  ))
  .add('Bold', () => (
    <SerifText bold>
      {`"God's commands are designed to guide you to life's very best. You will not obey Him, if you do not believe Him and trust Him. You cannot believe Him if you do not love Him. You cannot love Him unless you know Him." ― Henry Blackaby`}
    </SerifText>
  ))
  .add('Italic', () => (
    <SerifText italic>
      {`"God's commands are designed to guide you to life's very best. You will not obey Him, if you do not believe Him and trust Him. You cannot believe Him if you do not love Him. You cannot love Him unless you know Him." ― Henry Blackaby`}
    </SerifText>
  ))
  .add('Bold Italic', () => (
    <SerifText bold italic>
      {`"God's commands are designed to guide you to life's very best. You will not obey Him, if you do not believe Him and trust Him. You cannot believe Him if you do not love Him. You cannot love Him unless you know Him." ― Henry Blackaby`}
    </SerifText>
  ))
  .add('isLoading', () => (
    <SerifText isLoading>
      {`"God's commands are designed to guide you to life's very best. You will not obey Him, if you do not believe Him and trust Him. You cannot believe Him if you do not love Him. You cannot love Him unless you know Him." ― Henry Blackaby`}
    </SerifText>
  ))
  .add('Border Box – platform testing', () => {
    const border = { borderWidth: 1, borderStyle: 'solid' };

    return (
      <View>
        <SerifText style={border}>Body Text</SerifText>
        <SerifText style={border}>
          {`"God's commands are designed to guide you to life's very best. You will not obey Him, if you do not believe Him and trust Him. You cannot believe Him if you do not love Him. You cannot love Him unless you know Him." ― Henry Blackaby`}
        </SerifText>
      </View>
    );
  });
