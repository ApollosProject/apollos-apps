// @ts-nocheck
import * as React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNowPlaying } from '../context';
import { H4, Icon, styled } from '@apollosproject/ui-kit';

const VideoSelectContainer = styled(
  { marginHorizontal: 16, zIndex: 30 },
  'ui-media-player.VideoSelectContainer'
)(View);

const VideoSelectButton = styled(
  {
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignSelf: 'flex-start',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 8,
  },
  'ui-media-player.VideoSelectButton'
)(View);

const VideoSelectButtonText = styled(
  {
    color: 'black',
    paddingVertical: 4,
    paddingRight: 8,
  },
  'ui-media-player.VideoSelectButtonText'
)(H4);

const VideoSelectDropdownContainer = styled(
  {
    borderBottomColor: 'rgba(0,0,0,0.1)',
    borderBottomWidth: 1,
  },
  'ui-media-player.VideoSelectDropdownContainer'
)(View);

const VideoSelectDropdownOption = styled(
  {
    borderBottomColor: 'rgba(0,0,0,0.1)',
    borderBottomWidth: 1,
  },
  'ui-media-player.VideoSelectDropdownOption'
)(View);

const VideoSelectDropdownOptionText = styled(
  {
    color: 'black',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  'ui-media-player.VideoSelectDropdownOptionText'
)(H4);

const VideoSelect = ({
  videos = [],
}: {
  videos?: Array<{ sources: Array<{}> }>;
}) => {
  const activeVideo = useNowPlaying();
  const [optionsVisible, setOptionsVisible] = React.useState(false);

  function setActiveVideo(video: { sources: [{}] }) {
    activeVideo.setNowPlaying({ ...activeVideo, source: video.sources[0] });
    setOptionsVisible(false);
  }

  function getActiveVideoName() {
    return videos.filter(
      (video) =>
        JSON.stringify(video.sources[0]) === JSON.stringify(activeVideo.source)
    )[0].name;
  }

  if (videos.length > 1) {
    return (
      <VideoSelectContainer>
        <VideoSelectButton onPress={() => setOptionsVisible(!optionsVisible)}>
          <VideoSelectButtonText>{getActiveVideoName()}</VideoSelectButtonText>
          <Icon name="arrow-down" size={15} fill="black" />
        </VideoSelectButton>
        {optionsVisible && (
          <VideoSelectDropdownContainer>
            {videos.map((video) => (
              <VideoSelectDropdownOption>
                <TouchableOpacity onPress={() => setActiveVideo(video)}>
                  <VideoSelectDropdownOptionText>
                    {video.name}
                  </VideoSelectDropdownOptionText>
                </TouchableOpacity>
              </VideoSelectDropdownOption>
            ))}
          </VideoSelectDropdownContainer>
        )}
      </VideoSelectContainer>
    );
  } else {
    return null;
  }
};

export default VideoSelect;
