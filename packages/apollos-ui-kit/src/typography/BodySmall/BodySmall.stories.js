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
        '"He who lays up treasures on earth spends his life backing away from his treasures. To him, death is loss. He who lays up treasures in heaven looks forward to eternity; he’s moving daily toward his treasures. To him, death is gain." ― Randy Alcorn'
      }
    </BodySmall>
  ))
  .add('Bold', () => (
    <BodySmall bold>
      {
        '"He who lays up treasures on earth spends his life backing away from his treasures. To him, death is loss. He who lays up treasures in heaven looks forward to eternity; he’s moving daily toward his treasures. To him, death is gain." ― Randy Alcorn'
      }
    </BodySmall>
  ))
  .add('Italic', () => (
    <BodySmall italic>
      {
        '"He who lays up treasures on earth spends his life backing away from his treasures. To him, death is loss. He who lays up treasures in heaven looks forward to eternity; he’s moving daily toward his treasures. To him, death is gain." ― Randy Alcorn'
      }
    </BodySmall>
  ))
  .add('Bold Italic', () => (
    <BodySmall bold italic>
      {
        '"He who lays up treasures on earth spends his life backing away from his treasures. To him, death is loss. He who lays up treasures in heaven looks forward to eternity; he’s moving daily toward his treasures. To him, death is gain." ― Randy Alcorn'
      }
    </BodySmall>
  ))
  .add('Border Box – platform testing', () => {
    const border = { borderWidth: 1, borderStyle: 'solid' };

    return (
      <View>
        <BodySmall style={border}>BodySmall Text</BodySmall>
        <BodySmall style={border}>
          {
            '"He who lays up treasures on earth spends his life backing away from his treasures. To him, death is loss. He who lays up treasures in heaven looks forward to eternity; he’s moving daily toward his treasures. To him, death is gain." ― Randy Alcorn'
          }
        </BodySmall>
      </View>
    );
  });

storiesOf('ui-kit/typography/BodySmall', module).add('isLoading', () => (
  <BodySmall isLoading>
    {
      '"He who lays up treasures on earth spends his life backing away from his treasures. To him, death is loss. He who lays up treasures in heaven looks forward to eternity; he’s moving daily toward his treasures. To him, death is gain." ― Randy Alcorn'
    }
  </BodySmall>
));
