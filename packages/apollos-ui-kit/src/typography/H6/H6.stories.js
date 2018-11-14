import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';

import { Paragraph, BodyText } from '..';
import PaddedView from '../../PaddedView';

import H6 from '.';

storiesOf('typography/H6', module)
  .add('Default', () => (
    <H6>
      {
        '"Radical obedience to Christ is not easy... It\'s not comfort, not health, not wealth, and not prosperity in this world. Radical obedience to Christ risks losing all these things. But in the end, such risk finds its reward in Christ. And He is more than enough for us." ― David Platt'
      }
    </H6>
  ))
  .add('padded', () => (
    <PaddedView>
      <Paragraph>
        <BodyText>
          <BodyText italic>Paragraph</BodyText>
          {
            " blessed is the man who doesn't walk in the counsel of the wicked, nor stand in the way of sinners, nor sit in the seat of scoffers; but his delight is in Yahweh's law. On his law he meditates day and night. He will be like a tree planted by the streams of water, that brings forth its fruit in its season, whose leaf also does not wither. Whatever he does shall prosper. The wicked are not so, but are like the chaff which the wind drives away. Therefore the wicked shall not stand in the judgment, nor sinners in the congregation of the righteous. For Yahweh knows the way of the righteous, but the way of the wicked shall perish."
          }
        </BodyText>
      </Paragraph>
      <H6 padded>Padded Heading The Story of The Longest Heading Ever</H6>
      <Paragraph>
        <BodyText>
          <BodyText italic>Paragraph</BodyText>
          {
            " why do the nations rage, and the peoples plot a vain thing? The kings of the earth take a stand, and the rulers take counsel together, against Yahweh, and against his Anointed, saying, «Let's break their bonds apart, and cast their cords from us. He who sits in the heavens will laugh. The LORD will have them in derision. Then he will speak to them in his anger, and terrify them in his wrath: Yet I have set my King on my holy hill of Zion.» I will tell of the decree. Yahweh said to me, You are my son. Today I have become your father. Ask of me, and I will give the nations for your inheritance, the uttermost parts of the earth for your possession. You shall break them with a rod of iron. You shall dash them in pieces like a potter's vessel. Now therefore be wise, you kings. Be instructed, you judges of the earth. Serve Yahweh with fear, and rejoice with trembling. Give sincere homage to the Son, lest he be angry, and you perish in the way, for his wrath will soon be kindled. Blessed are all those who take refuge in him."
          }
        </BodyText>
      </Paragraph>
    </PaddedView>
  ))
  .add('isLoading', () => (
    <H6 isLoading>
      {
        '"Radical obedience to Christ is not easy... It\'s not comfort, not health, not wealth, and not prosperity in this world. Radical obedience to Christ risks losing all these things. But in the end, such risk finds its reward in Christ. And He is more than enough for us." ― David Platt'
      }
    </H6>
  ))
  .add('Border Box – platform testing', () => {
    const border = { borderWidth: 1, borderStyle: 'solid' };

    return (
      <View>
        <H6 style={border}>Heading 6</H6>
        <H6 style={border}>
          {
            '"Radical obedience to Christ is not easy... It\'s not comfort, not health, not wealth, and not prosperity in this world. Radical obedience to Christ risks losing all these things. But in the end, such risk finds its reward in Christ. And He is more than enough for us." ― David Platt'
          }
        </H6>
      </View>
    );
  });
