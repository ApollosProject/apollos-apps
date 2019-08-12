import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import { H6, H4 } from '../typography';
import styled from '../styled';
import TouchableScale from '../TouchableScale';
import ConnectedImage, { ImageSourceType } from '../ConnectedImage';
import FlexedView from '../FlexedView';

const CellImage = styled(({ theme }) => ({
  width: theme.sizing.baseUnit * 4,
  height: theme.sizing.baseUnit * 4,
  borderRadius: theme.sizing.baseUnit,
  overflow: 'hidden',
  marginRight: theme.sizing.baseUnit,
}))(View);

const StyledH6 = styled(({ theme }) => ({
  color: theme.colors.text.tertiary,
}))(H6);

const TextContainer = styled(({ theme }) => ({
  justifyContent: 'center',
  marginTop: theme.sizing.baseUnit / 2.5,
  borderBottomWidth: 0.5,
  height: theme.sizing.baseUnit * 4.25,
  borderColor: theme.colors.shadows.default,
}))(FlexedView);

const Cell = styled(({ theme }) => ({
  paddingHorizontal: theme.sizing.baseUnit,
  paddingVertical: theme.sizing.baseUnit / 4,
  backgroundColor: theme.colors.background.paper,
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
}))(View);

const ContentTableCardItem = ({
  imageSource,
  title,
  id,
  label,
  onPressActionItem,
}) => (
  <TouchableScale
    onPress={() =>
      onPressActionItem({
        id,
        transitionKey: 2,
      })
    }
  >
    <Cell>
      <CellImage>
        <ConnectedImage source={imageSource} />
      </CellImage>
      <TextContainer>
        {label ? <StyledH6 numberOfLines={1}>{label}</StyledH6> : null}
        <H4 numberOfLines={2} ellipsizeMode="tail">
          {title}
        </H4>
      </TextContainer>
    </Cell>
  </TouchableScale>
);

ContentTableCardItem.propTypes = {
  imageSource: ImageSourceType.isRequired,
  title: PropTypes.string.isRequired,
  id: PropTypes.string,
  label: PropTypes.string,
  onPressActionItem: PropTypes.func,
};

export default ContentTableCardItem;
