import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import { H5, BodySmall } from '../../typography';
import styled from '../../styled';
import TouchableScale from '../../TouchableScale';
import { ImageSourceType } from '../../ConnectedImage';
import FlexedView from '../../FlexedView';
import ActionListImage from './ActionListImage';

const Label = styled(
  ({ theme }) => ({
    color: theme.colors.text.tertiary,
  }),
  'ui-kit.ActionList.ActionListItem.Label'
)(BodySmall);

const TextContainer = styled(
  {
    justifyContent: 'center',
  },
  'ui-kit.ActionList.ActionListItem.TextContainer'
)(FlexedView);

const Cell = styled(
  ({ theme }) => ({
    paddingBottom: theme.sizing.baseUnit * 0.5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  }),
  'ui-kit.ActionList.ActionListItem.Cell'
)(View);

// eslint-disable-next-line react/prop-types
const RenderAsTouchable = ({ children, onPress }) =>
  onPress ? (
    <TouchableScale onPress={onPress}>{children}</TouchableScale>
  ) : (
    children
  );

const ActionListItem = ({ imageSource, title, label, onPress, start }) => (
  <RenderAsTouchable onPress={onPress}>
    <Cell>
      <ActionListImage source={imageSource} start={start} />
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
  start: PropTypes.string,
};

export default ActionListItem;
