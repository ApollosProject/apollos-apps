import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import { H5, BodySmall } from '../../typography';
import styled from '../../styled';
import TouchableScale from '../../TouchableScale';
import { ImageSourceType } from '../../ConnectedImage';
import FlexedView from '../../FlexedView';
import ActionListImage from './ActionListImage';

const StyledBodySmall = styled(
  ({ theme }) => ({
    color: theme.colors.text.tertiary,
  }),
  'ui-kit.ActionListCard.ActionListItem.StyledBodySmall'
)(BodySmall);

const TextContainer = styled(
  ({ theme }) => ({
    justifyContent: 'center',
    marginTop: theme.sizing.baseUnit / 2.5,
    borderBottomWidth: 0.5,
    height: theme.sizing.baseUnit * 4.25,
    borderColor: theme.colors.shadows.default,
  }),
  'ui-kit.ActionListCard.ActionListItem.TextContainer'
)(FlexedView);

const Cell = styled(
  ({ theme }) => ({
    paddingHorizontal: theme.sizing.baseUnit,
    paddingVertical: theme.sizing.baseUnit / 4,
    backgroundColor: theme.colors.background.paper,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  }),
  'ui-kit.ActionListCard.ActionListItem.Cell'
)(View);

const ActionListItem = ({
  imageSource,
  title,
  action,
  relatedNode,
  label,
  onPressActionItem,
  isLoading,
}) => (
  <TouchableScale onPress={() => onPressActionItem({ action, relatedNode })}>
    <Cell>
      <ActionListImage
        relatedNode={relatedNode}
        source={imageSource}
        isLoading={isLoading}
      />
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
  imageSource: ImageSourceType,
  title: PropTypes.string,
  action: PropTypes.string,
  relatedNode: PropTypes.any, // eslint-disable-line
  label: PropTypes.string,
  onPressActionItem: PropTypes.func,
  isLoading: PropTypes.func,
};

export default ActionListItem;
