import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { BodyText, Paragraph } from 'ui/typography';

import H4 from '.';

storiesOf('typography/H4', module)
  .add('Default', () => (
    <H4>
      {
        '"What you are is God\'s gift to you, what you become is your gift to God." ― Hans Urs von Balthasar'
      }
    </H4>
  ))
  .add('padded', () => (
    <View>
      <Paragraph>
        <BodyText>
          {
            "\"What you are is God's gift to you, what you become is your gift to God. What you are is God's gift to you, what you become is your gift to God. What you are is God's gift to you, what you become is your gift to God. What you are is God's gift to you, what you become is your gift to God. What you are is God's gift to you, what you become is your gift to God. What you are is God's gift to you, what you become is your gift to God. What you are is God's gift to you, what you become is your gift to God. \""
          }
        </BodyText>
      </Paragraph>
      <H4 padded>Hans Urs von Balthasar</H4>
      <Paragraph>
        <BodyText>
          {
            "\"What you are is God's gift to you, what you become is your gift to God. What you are is God's gift to you, what you become is your gift to God. What you are is God's gift to you, what you become is your gift to God. What you are is God's gift to you, what you become is your gift to God. What you are is God's gift to you, what you become is your gift to God. What you are is God's gift to you, what you become is your gift to God. What you are is God's gift to you, what you become is your gift to God. \""
          }
        </BodyText>
      </Paragraph>
    </View>
  ))
  .add('isLoading', () => (
    <H4 isLoading>
      {
        '"What you are is God\'s gift to you, what you become is your gift to God." ― Hans Urs von Balthasar'
      }
    </H4>
  ))
  .add('Border Box – platform testing', () => {
    const border = { borderWidth: 1, borderStyle: 'solid' };

    return (
      <View>
        <H4 style={border}>Heading 4</H4>
        <H4 style={border}>
          {
            '"What you are is God\'s gift to you, what you become is your gift to God." ― Hans Urs von Balthasar'
          }
        </H4>
      </View>
    );
  });
