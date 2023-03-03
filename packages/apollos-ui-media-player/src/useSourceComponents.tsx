// hook the provides a VideoComponent and ControlComponent based on provided source
import * as React from 'react';
import { Platform } from 'react-native';
import Controls from './Controls';
import RNVideo from './RNVideo';
import WebVideo from './WebVideo';
import YoutubeVideo, { youtubeRegEx } from './YoutubeVideo';

import type { IPlayerMedia } from './types';

const NativeComponents = {
  VideoComponent: RNVideo,
  ControlsComponent: Controls,
};

const WebViewComponents = {
  VideoComponent: WebVideo,
  ControlsComponent: null,
  allowFullscreenControl: false,
};

const YoutubeComponents = {
  VideoComponent: YoutubeVideo,
  ControlsComponent: null,
  allowFullscreenControl: false,
};

const useSourceComponents = ({
  VideoComponent,
  ControlsComponent,
  source,
}: {
  source?: IPlayerMedia['source'];
  VideoComponent?: React.FunctionComponent;
  ControlsComponent?: React.FunctionComponent;
}) => {
  return React.useMemo(() => {
    const isWebView = !source?.uri && !!source?.html;
    const youtubeId =
      source?.html?.match(youtubeRegEx)?.[1] ||
      source?.uri?.match(youtubeRegEx)?.[1];

    const isResiSpecialCase =
      source?.uri?.includes('resi') &&
      source?.html &&
      Platform.OS === 'android';

    return Object.assign(
      {},
      NativeComponents,
      isWebView ? WebViewComponents : {},
      youtubeId ? YoutubeComponents : {},
      isResiSpecialCase ? WebViewComponents : {},
      VideoComponent ? { VideoComponent } : {},
      ControlsComponent ? { ControlsComponent } : {}
    );
  }, [source?.html, source?.uri, VideoComponent, ControlsComponent]);
};

export default useSourceComponents;
