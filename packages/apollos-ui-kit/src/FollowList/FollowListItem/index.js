import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import { H5 } from '../../typography';
import styled from '../../styled';
import { ImageSourceType } from '../../ConnectedImage';
import FlexedView from '../../FlexedView';
import FollowListImage from '../FollowListImage';
import Button from '../../Button';

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

const FollowListItem = ({ imageSource, name }) => (
  <Cell>
    <FollowListImage source={imageSource} />
    <TextContainer>
      {name ? <H5 numberOfLines={1}>{name}</H5> : null}
    </TextContainer>
    <Button pill={false} title="Hide" type="default" />
    <Button
      pill={false}
      title="Confirm"
      type="primary"
      style={{ marginLeft: 10 }}
    />
  </Cell>
);

FollowListItem.propTypes = {
  imageSource: ImageSourceType.isRequired,
  name: PropTypes.string,
};

export default FollowListItem;
