import React from 'react';
// import ShallowRenderer from 'react-test-renderer/shallow';
import renderer from 'react-test-renderer';

import { Text, ScrollView } from 'react-native';
import { ApollosPlayerContainer, PictureMode } from '../index';
import { Providers } from '@apollosproject/ui-test-utils';

import {
  useNowPlaying,
  usePlayerControls,
  useInternalPlayer,
  usePlayhead,
} from '../context';

jest.useFakeTimers();

describe('The media player', () => {
  it('renders', () => {
    const tree = renderer.create(
      <Providers>
        <ApollosPlayerContainer
          autoplay
          source={{
            uri:
              'http://embed.wistia.com/deliveries/0e364f7e6f6604384ece8a35905a53a864386e9f.bin',
          }}
          presentationProps={{
            title: 'Video Title',
            description: 'Video Description',
          }}
          coverImage={{
            uri: `https://picsum.photos/seed/123/100/100`,
          }}
        >
          <Text>---------</Text>
        </ApollosPlayerContainer>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });

  it('can change media', () => {
    const source1 =
      'http://embed.wistia.com/deliveries/0e364f7e6f6604384ece8a35905a53a864386e9f.bin';
    const source2 = 'blah';
    const TestCase = () => {
      const { source, setNowPlaying } = useNowPlaying();
      if (source?.uri === source1) {
        setNowPlaying({ source: { uri: source2 } });
      }
      return null;
    };

    const tree = renderer.create(
      <Providers>
        <ApollosPlayerContainer
          autoplay
          source={{
            uri:
              'http://embed.wistia.com/deliveries/0e364f7e6f6604384ece8a35905a53a864386e9f.bin',
          }}
          presentationProps={{
            title: 'Video Title',
            description: 'Video Description',
          }}
          coverImage={{
            uri: `https://picsum.photos/seed/123/100/100`,
          }}
        >
          <TestCase />
        </ApollosPlayerContainer>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });

  it('can play media', () => {
    const TestCase = () => {
      const { isPlaying, play } = usePlayerControls();
      if (!isPlaying) {
        play();
      }
      return null;
    };

    const tree = renderer.create(
      <Providers>
        <ApollosPlayerContainer
          source={{
            uri:
              'http://embed.wistia.com/deliveries/0e364f7e6f6604384ece8a35905a53a864386e9f.bin',
          }}
          presentationProps={{
            title: 'Video Title',
            description: 'Video Description',
          }}
          coverImage={{
            uri: `https://picsum.photos/seed/123/100/100`,
          }}
        >
          <TestCase />
        </ApollosPlayerContainer>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });

  it('can pause media', () => {
    const TestCase = () => {
      const { isPlaying, pause } = usePlayerControls();
      if (isPlaying) {
        pause();
      }
      return null;
    };

    const tree = renderer.create(
      <Providers>
        <ApollosPlayerContainer
          autoplay
          source={{
            uri:
              'http://embed.wistia.com/deliveries/0e364f7e6f6604384ece8a35905a53a864386e9f.bin',
          }}
          presentationProps={{
            title: 'Video Title',
            description: 'Video Description',
          }}
          coverImage={{
            uri: `https://picsum.photos/seed/123/100/100`,
          }}
        >
          <TestCase />
        </ApollosPlayerContainer>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });

  it('can update playhead', () => {
    const TestCase = () => {
      const playhead = usePlayhead();
      const player = useInternalPlayer();
      if (playhead.elapsedTime < 100 || !playhead.elapsedTime) {
        player.updatePlayhead({
          elapsedTime: 200,
          totalDuration: 400,
          seekableDuration: 400,
          playableDuration: 400,
        });
      }
      return <Text>{playhead.elapsedTime}</Text>;
    };

    const tree = renderer.create(
      <Providers>
        <ApollosPlayerContainer
          autoplay
          source={{
            uri:
              'http://embed.wistia.com/deliveries/0e364f7e6f6604384ece8a35905a53a864386e9f.bin',
          }}
          presentationProps={{
            title: 'Video Title',
            description: 'Video Description',
          }}
          coverImage={{
            uri: `https://picsum.photos/seed/123/100/100`,
          }}
        >
          <TestCase />
        </ApollosPlayerContainer>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });

  it('can go fullscreen', () => {
    const TestCase = () => {
      const { pictureMode, setPictureMode } = usePlayerControls();
      if (pictureMode !== PictureMode.Fullscreen) {
        setPictureMode(PictureMode.Fullscreen);
      }
      return null;
    };

    const tree = renderer.create(
      <Providers>
        <ApollosPlayerContainer
          autoplay
          source={{
            uri:
              'http://embed.wistia.com/deliveries/0e364f7e6f6604384ece8a35905a53a864386e9f.bin',
          }}
          presentationProps={{
            title: 'Video Title',
            description: 'Video Description',
          }}
          coverImage={{
            uri: `https://picsum.photos/seed/123/100/100`,
          }}
        >
          <TestCase />
        </ApollosPlayerContainer>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });

  it('can go PiP', () => {
    const TestCase = () => {
      const { pictureMode, setPictureMode } = usePlayerControls();
      if (pictureMode !== PictureMode.PictureInPicture) {
        setPictureMode(PictureMode.PictureInPicture);
      }
      return null;
    };

    const tree = renderer.create(
      <Providers>
        <ApollosPlayerContainer
          autoplay
          source={{
            uri:
              'http://embed.wistia.com/deliveries/0e364f7e6f6604384ece8a35905a53a864386e9f.bin',
          }}
          presentationProps={{
            title: 'Video Title',
            description: 'Video Description',
          }}
          coverImage={{
            uri: `https://picsum.photos/seed/123/100/100`,
          }}
        >
          <TestCase />
        </ApollosPlayerContainer>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });

  it('scrolls', () => {
    const TestCase = () => {
      const scrollView = React.useRef<ScrollView>(null);
      scrollView.current?.scrollTo({ y: 500 });

      return (
        <ApollosPlayerContainer
          scrollViewRef={scrollView}
          collapseOnScroll
          source={{
            uri:
              'http://embed.wistia.com/deliveries/0e364f7e6f6604384ece8a35905a53a864386e9f.bin',
          }}
          presentationProps={{
            title: 'Video Title',
            description: 'Video Description',
          }}
          coverImage={{
            uri: `https://picsum.photos/seed/123/100/100`,
          }}
        />
      );
    };

    const tree = renderer.create(
      <Providers>
        <TestCase />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });

  it('can go live', () => {
    const tree = renderer.create(
      <Providers>
        <ApollosPlayerContainer
          autoplay
          isLive
          source={{
            uri:
              'http://embed.wistia.com/deliveries/0e364f7e6f6604384ece8a35905a53a864386e9f.bin',
          }}
          presentationProps={{
            title: 'Video Title',
            description: 'Video Description',
          }}
          coverImage={{
            uri: `https://picsum.photos/seed/123/100/100`,
          }}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });

  it('can unmount cleanly', () => {
    const TestCase = () => {
      const [isRendered, setIsRendered] = React.useState(true);
      React.useEffect(() => {
        setIsRendered(false);
      }, []);
      return isRendered ? (
        <ApollosPlayerContainer
          autoplay
          isLive
          source={{
            uri:
              'http://embed.wistia.com/deliveries/0e364f7e6f6604384ece8a35905a53a864386e9f.bin',
          }}
          presentationProps={{
            title: 'Video Title',
            description: 'Video Description',
          }}
          coverImage={{
            uri: `https://picsum.photos/seed/123/100/100`,
          }}
        />
      ) : null;
    };

    const tree = renderer.create(
      <Providers>
        <TestCase />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
