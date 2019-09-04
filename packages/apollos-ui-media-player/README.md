# Apollos UI: MediaPlayer

Provides a media player to render Video and Audio content in the app. Both fullscreen and in a conveniant Mini Player.

## Installation:

1. Install library and peer dependencies from `npm`:

```
yarn add @apollosproject/apollos-ui-media-player react-native-video react-native-music-control react-native-video-controls @apollosproject/react-native-airplay-btn
```

2. Link native dependencies

```
yarn run react-native link
```

## Usage

Integrating this module requires a few steps.

1. Render the MediaPlayer at the bottom of your App component tree.

```
import { MediaPlayer } from '@apollosproject/ui-media-player';
...
const App = () => (
  <Providers>
    <BackgroundView>
      <AppStatusBar barStyle="dark-content" />
      <AppNavigator
        ref={(navigatorRef) => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
      <MediaPlayer /> // <-- add this
    </BackgroundView>
  </Providers>
);
```

2. Include the Provider

```
import { MediaPlayerProvider } from '@apollosproject/ui-media-player';

const AppProviders = (props) => (
  <ClientProvider {...props}>
    <NotificationsManager>
      <AuthProvider
        navigateToAuth={() => NavigationService.navigate('Auth')}
        closeAuth={() => NavigationService.navigate('Onboarding')}
      >
        <MediaPlayerProvider>
          <AnalyticsProvider>
            <Providers {...props} />
          </AnalyticsProvider>
        </MediaPlayerProvider>
      </AuthProvider>
    </NotificationsManager>
  </ClientProvider>
);
```

3. Where needed, include a MediaPlayerSpacer. This component will increase it's own height when the MiniPlayer is rendered. Useful for TabBars and other static footers.

```
import { MediaPlayerSpacer } from '@apollosproject/ui-media-player';
...
const ActionContainer = ({ itemId }) => (
  <Container>
    <MediaPlayerSpacer>
      <PositioningView>
        <LikeButton itemId={itemId} />
        <Query query={GET_SHARE_CONTENT} variables={{ itemId }}>
          {({ data: { node } = {}, error, loading }) => {
            const sharing = get(node, 'sharing');
            return loading || error || !sharing ? null : (
              <Share content={sharing} />
            );
          }}
        </Query>
      </PositioningView>
    </MediaPlayerSpacer>
  </Container>
);
```

4. Wire up ways to "call" the media player. We export a series of `Mutations` that can be used to pause, play, and advance the media player. Example:

```
import { PLAY_VIDEO } from '@apollosproject/ui-media-player';
...
      <Mutation mutation={PLAY_VIDEO}>
        {(play) => (
          <Container>
            {videoSource ? (
              <MediaButtonBorder>
                <MediaButton
                  type="primary"
                  onPress={() =>
                    play({
                      variables: {
                        mediaSource: videoSource,
                        posterSources: coverImageSources,
                        title,
                        isVideo: true,
                        artist: parentChannel.name,
                      },
                    })
                  }
                  useForeground
                >
                  <MediaIcon name="play" />
                </MediaButton>
              </MediaButtonBorder>
            ) : null}
          </Container>
        )}
      </Mutation>
```