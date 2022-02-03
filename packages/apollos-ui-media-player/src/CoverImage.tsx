import * as React from 'react';
import type { IPlayerMedia } from './types';
import { View, StyleSheet } from 'react-native';
import { ConnectedImage, styled } from '@apollosproject/ui-kit';

const Wrapper = styled(StyleSheet.absoluteFillObject)(View);

const BackgroundImage = styled({
  backgroundColor: 'transparent',
  ...StyleSheet.absoluteFillObject,
})(ConnectedImage);

const InnerImage = styled({
  ...StyleSheet.absoluteFillObject,
  backgroundColor: 'transparent',
})(ConnectedImage);

const CoverImage: React.FunctionComponent<{
  source: IPlayerMedia['coverImage'];
}> = ({ source }) => (
  <Wrapper>
    <BackgroundImage resizeMode="cover" blurRadius={24} source={source} />
    <InnerImage source={source} resizeMode="contain" />
  </Wrapper>
);

export default CoverImage;
