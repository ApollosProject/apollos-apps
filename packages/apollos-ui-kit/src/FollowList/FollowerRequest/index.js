import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import { H5, BodySmall } from '../../typography';
import styled from '../../styled';
import { ImageSourceType } from '../../ConnectedImage';
import FlexedView from '../../FlexedView';
import FollowListImage from '../FollowListImage';
import Button from '../../Button';
import PaddedView from '../../PaddedView';

const Label = styled(
  ({ theme }) => ({
    color: theme.colors.text.tertiary,
  }),
  'ui-kit.FollowList.FollowListItem.Label'
)(BodySmall);

const TextContainer = styled(
  {
    justifyContent: 'center',
  },
  'ui-kit.FollowList.FollowListItem.TextContainer'
)(FlexedView);

const Cell = styled(
  ({ theme }) => ({
    paddingBottom: theme.sizing.baseUnit * 0.5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  }),
  'ui-kit.FollowList.FollowListItem.Cell'
)(View);

const FollowerRequest = ({ imageSource, title, label, start }) => (
  <Cell>
    <FollowListImage source={imageSource} start={start} />
    <TextContainer>
      {title ? <H5 numberOfLines={!label ? 2 : 1}>{title}</H5> : null}
      {label ? (
        <Label numberOfLines={!title ? 3 : 2} ellipsizeMode="tail">
          {label}
        </Label>
      ) : null}
    </TextContainer>
    <PaddedView>
      <Button
        onPress={() => {}}
        title="Just a plain 'ole Square Button"
        pill={false}
      />
    </PaddedView>
  </Cell>
);

FollowerRequest.propTypes = {
  imageSource: ImageSourceType.isRequired,
  title: PropTypes.string,
  label: PropTypes.string,
  start: PropTypes.string,
};

export default FollowerRequest;
