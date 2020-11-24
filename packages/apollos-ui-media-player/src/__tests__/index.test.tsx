import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { Text } from 'react-native';
import { ApollosPlayerContainer } from '../index';
import { Providers } from '@apollosproject/ui-test-utils';

jest.useFakeTimers();

describe('The media player', () => {
  it('renders', () => {
    const renderer = new ShallowRenderer();
    const tree = renderer.render(<Providers><ApollosPlayerContainer
    source={{
      uri:
        'http://embed.wistia.com/deliveries/0e364f7e6f6604384ece8a35905a53a864386e9f.bin',
    }}
    presentationProps={{
      title: 'Video Title',
      description: 'Video Description',
    }}
    coverImage={{
      uri: `https://picsum.photos/seed/${Math.random()}/100/100`,
    }}
  >
    <Text>---------</Text>
  </ApollosPlayerContainer></Providers>);
    expect(tree).toMatchSnapshot();
  });
});
