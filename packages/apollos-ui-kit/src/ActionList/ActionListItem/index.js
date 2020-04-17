import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import { H5, BodySmall } from '../../typography';
import styled from '../../styled';
import TouchableScale from '../../TouchableScale';
import ConnectedImage, { ImageSourceType } from '../../ConnectedImage';
import FlexedView from '../../FlexedView';

const StyledBodySmall = styled(({ theme }) => ({
  color: theme.colors.text.tertiary,
}))(BodySmall);

const TextContainer = styled(({ theme }) => ({
  justifyContent: 'center',
  borderBottomWidth: 0.5,
  borderColor: theme.colors.shadows.default,
}))(FlexedView);

const Cell = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit * 0.5,
  flexDirection: 'row',
  justifyContent: 'flex-start',
}))(View);

const CellImage = styled(({ theme }) => ({
  width: theme.sizing.baseUnit * 4,
  height: theme.sizing.baseUnit * 4,
  borderRadius: theme.sizing.baseBorderRadius,
  marginRight: theme.sizing.baseUnit,
}))(ConnectedImage);

const ActionListItem = ({
  imageSource,
  title,
  action,
  relatedNode,
  label,
  onPressActionItem,
}) => (
  <TouchableScale onPress={() => onPressActionItem({ action, relatedNode })}>
    <Cell>
      <CellImage source={imageSource} />
      <TextContainer>
        {title ? <H5 numberOfLines={1}>{title}</H5> : null}
        <StyledBodySmall numberOfLines={2} ellipsizeMode="tail">
          {label}
        </StyledBodySmall>
      </TextContainer>
    </Cell>
  </TouchableScale>
);

ActionListItem.propTypes = {
  imageSource: ImageSourceType.isRequired,
  title: PropTypes.string.isRequired,
  action: PropTypes.string,
  relatedNode: PropTypes.any, // eslint-disable-line
  label: PropTypes.string,
  onPressActionItem: PropTypes.func,
};

export default ActionListItem;
