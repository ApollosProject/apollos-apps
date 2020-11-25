# react-native-apollos-player

An opinionated media player for react-native apps from The Apollos Project

## Installation

```sh
npm install react-native-apollos-player
```

## Usage

todo

## Architecture

- We still render player at root-level
- Need to figure out how to display above r-n modals / everything

On iOS we can't render on top of modals, but we can move the video around
On android we can still render on top of modals, but we cna't move the video around


## Exposed Components:

```jsx
<ApollosPlayerProvider />

<VideoPreviewView />
<VideoPreviewMiniIOS />

const { playNow, setIsPlaying, seek } = usePlayer();
const { setOverlayInsets, setPresentationMode, setOverlayIsVisible } = usePlayerPresentation();
```

```jsx
  <VideoPreviewView
    source={}
  />
```
  iOS: preview plays the specified media, as long as something else isn't already playing.
       on interaction, opens the media in full-screen Presentation
  Android: preview plays the specified media.
       On interaction, opens the media in full-screen Presentation

---

```jsx
  <VideoPreviewMiniIOS
    source={}
    isVisible
  />
```
  iOS: preview plays the specified media, unless something else is playing -
       in which case, it will play show media instead.
  Android:
       does not render. this gets picked up by the root-level player

---

## Internal (these are likely over-ride-able props on Provider)

- VideoTextureView
- MiniPresentation
- FullScreenPresentation

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
