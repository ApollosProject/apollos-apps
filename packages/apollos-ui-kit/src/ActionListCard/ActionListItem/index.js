import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import { H6, H4 } from '../../typography';
import styled from '../../styled';
import TouchableScale from '../../TouchableScale';
import ConnectedImage, { ImageSourceType } from '../../ConnectedImage';
import FlexedView from '../../FlexedView';

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

const CellImage = styled(({ theme }) => ({
  width: theme.sizing.baseUnit * 4,
  height: theme.sizing.baseUnit * 4,
  borderRadius: theme.sizing.baseUnit,
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
        {label ? <StyledH6 numberOfLines={1}>{label}</StyledH6> : null}
        <H4 numberOfLines={2} ellipsizeMode="tail">
          {title}
        </H4>
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
