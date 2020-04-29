import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import { H5, BodySmall } from '../../typography';
import styled from '../../styled';
import TouchableScale from '../../TouchableScale';
import ConnectedImage, { ImageSourceType } from '../../ConnectedImage';
import FlexedView from '../../FlexedView';

const Label = styled(
  ({ theme }) => ({
    color: theme.colors.text.tertiary,
  }),
  'ui-kit.ActionListItem.Label'
)(BodySmall);

const TextContainer = styled(
  {
    justifyContent: 'center',
  },
  'ui-kit.ActionListItem.TextContainer'
)(FlexedView);

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

// TODO: fix TouchableScale so that it doesn't animate if not passed an `onPress` handler. Then Remove lines 40-45.
// eslint-disable-next-line react/prop-types
const RenderAsTouchable = ({ children, onPress }) =>
  onPress ? (
    <TouchableScale onPress={() => onPress}>{children}</TouchableScale>
  ) : (
    children
  );

const ActionListItem = ({ imageSource, title, label, onPress }) => (
  <RenderAsTouchable onPress={onPress}>
    <Cell>
      <CellImage source={imageSource} />
      <TextContainer>
        {title ? <H5 numberOfLines={!label ? 2 : 1}>{title}</H5> : null}
        {label ? (
          <Label numberOfLines={!title ? 3 : 2} ellipsizeMode="tail">
            {label}
          </Label>
        ) : null}
      </TextContainer>
    </Cell>
  </RenderAsTouchable>
);

ActionListItem.propTypes = {
  imageSource: ImageSourceType.isRequired,
  title: PropTypes.string,
  label: PropTypes.string,
  onPress: PropTypes.func,
};

export default ActionListItem;