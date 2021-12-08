import React from 'react';
import * as PhosphorIcons from 'phosphor-react-native';
import PropTypes from 'prop-types';
import * as CoreIcons from './core';

function withPhosphorIcon(PhosphorIcon, defaultWeight) {
  function OriginalPhosphorIcon({ size, fill, weight }) {
    return (
      <PhosphorIcon size={size} color={fill} weight={weight || defaultWeight} />
    );
  }

  OriginalPhosphorIcon.propTypes = {
    size: PropTypes.number,
    fill: PropTypes.string,
    weight: PropTypes.string,
  };

  return OriginalPhosphorIcon;
}

const phosphorIconMap = {
  ArrowBack: {
    name: 'ArrowLeft',
    weight: 'regular',
  },
  ArrowDown: {
    name: 'ArrowDown',
    weight: 'regular',
  },
  ArrowDownRight: {
    name: 'ArrowDownRight',
    weight: 'regular',
  },
  ArrowNext: {
    name: 'ArrowRight',
    weight: 'regular',
  },
  ArrowUp: {
    name: 'ArrowUp',
    weight: 'regular',
  },
  ArrowOut: {
    name: 'ArrowsOutSimple',
    weight: 'regular',
  },
  ArrowIn: {
    name: 'ArrowsInSimple',
    weight: 'regular',
  },
  Audio: {
    name: 'SpeakerHigh',
    weight: 'regular',
  },
  Avatar: {
    name: 'User',
    weight: 'regular',
  },
  Bank: {
    name: 'Bank',
    weight: 'regular',
  },
  Building: {
    name: 'Buildings',
    weight: 'regular',
  },
  Calendar: {
    name: 'CalendarBlank',
    weight: 'regular',
  },
  Camera: {
    name: 'Camera',
    weight: 'regular',
  },
  Check: {
    name: 'Check',
    weight: 'regular',
  },
  CheckboxChecked: {
    name: 'CheckSquare',
    weight: 'regular',
  },
  CheckboxUnchecked: {
    name: 'Square',
    weight: 'regular',
  },
  CircleOutlineCheckMark: {
    name: 'CheckCircle',
    weight: 'regular',
  },
  CircleOutlineXMark: {
    name: 'XCircle',
    weight: 'regular',
  },
  CircleOutlinePlus: {
    name: 'PlusCircle',
    weight: 'regular',
  },
  Close: {
    name: 'XCircle',
    weight: 'fill',
  },
  Credit: {
    name: 'CreditCard',
    weight: 'regular',
  },
  DotsThreeVertical: {
    name: 'DotsThree',
    weight: 'regular',
  },
  Chromecast: {
    name: 'Screencast',
    weight: 'regular',
  },
  ChunkyPlus: {
    name: 'Plus',
    weight: 'bold',
  },
  Download: {
    name: 'DownloadSimple',
    weight: 'regular',
  },
  Dropdown: {
    name: 'CaretDown',
    weight: 'regular',
  },
  Failed: {
    name: 'WarningCircle',
    weight: 'regular',
  },
  Filter: {
    name: 'Faders',
    weight: 'regular',
  },
  Fullscreen: {
    name: 'ArrowsOutSimple',
    weight: 'regular',
  },
  Groups: {
    name: 'Users',
    weight: 'regular',
  },
  Home: {
    name: 'House',
    weight: 'regular',
  },
  Information: {
    name: 'Info',
    weight: 'regular',
  },
  Like: {
    name: 'Heart',
    weight: 'regular',
  },
  LikeSolid: {
    name: 'Heart',
    weight: 'fill',
  },
  Locate: {
    name: 'NavigationArrow',
    weight: 'regular',
  },
  Lock: {
    name: 'Lock',
    weight: 'regular',
  },
  Mute: {
    name: 'SpeakerSlash',
    weight: 'regular',
  },
  Pause: {
    name: 'Pause',
    weight: 'fill',
  },
  Pin: {
    name: 'PushPin',
    weight: 'regular',
  },
  Play: {
    name: 'Play',
    weight: 'fill',
  },
  PlayOpaque: {
    name: 'Play',
    weight: 'fill',
  },
  PlaySolid: {
    name: 'Play',
    weight: 'fill',
  },
  Plus: {
    name: 'Plus',
    weight: 'regular',
  },
  Print: {
    name: 'Printer',
    weight: 'regular',
  },
  PictureInPicture: {
    name: 'PictureInPicture',
    weight: 'regular',
  },
  Profile: {
    name: 'UserCircle',
    weight: 'regular',
  },
  RadioChecked: {
    name: 'CheckCircle',
    weight: 'regular',
  },
  RadioUnchecked: {
    name: 'Circle',
    weight: 'regular',
  },
  Repeat: {
    name: 'Repeat',
    weight: 'regular',
  },
  RepeatAll: {
    name: 'Repeat',
    weight: 'regular',
  },
  RepeatOne: {
    name: 'RepeatOnce',
    weight: 'regular',
  },
  Search: {
    name: 'MagnifyingGlass',
    weight: 'regular',
  },
  Sections: {
    name: 'List',
    weight: 'regular',
  },
  Settings: {
    name: 'Gear',
    weight: 'regular',
  },
  Share: {
    name: 'Share',
    weight: 'regular',
  },
  Shuffle: {
    name: 'Shuffle',
    weight: 'regular',
  },
  SkipForwardThirty: {
    name: 'ArrowClockwise',
    weight: 'regular',
  },
  SkipBackThirty: {
    name: 'ArrowCounterClockwise',
    weight: 'regular',
  },
  SkipNext: {
    name: 'SkipForward',
    weight: 'regular',
  },
  SkipPrevious: {
    name: 'SkipBack',
    weight: 'regular',
  },
  Text: {
    name: 'TextT',
    weight: 'regular',
  },
  ThumbsUp: {
    name: 'ThumbsUp',
    weight: 'regular',
  },
  ThumbsUpFilled: {
    name: 'ThumbsUp',
    weight: 'fill',
  },
  Time: {
    name: 'Clock',
    weight: 'regular',
  },
  Umbrella: {
    name: 'Umbrella',
    weight: 'regular',
  },
  Video: {
    name: 'VideoCamera',
    weight: 'regular',
  },
  VideoOff: {
    name: 'VideoCameraSlash',
    weight: 'regular',
  },
  Volume: {
    name: 'SpeakerHigh',
    weight: 'regular',
  },
  Warning: {
    name: 'Warning',
    weight: 'regular',
  },
};

const AllIcons = Object.fromEntries(
  Object.entries(CoreIcons).map(([name, Icon]) => {
    const phosphorIconMapping = phosphorIconMap[name];
    if (phosphorIconMapping) {
      return [
        name,
        withPhosphorIcon(
          PhosphorIcons[phosphorIconMapping.name],
          phosphorIconMapping.weight
        ),
      ];
    }

    return [name, Icon];
  })
);

export { CoreIcons, PhosphorIcons };
export default AllIcons;
