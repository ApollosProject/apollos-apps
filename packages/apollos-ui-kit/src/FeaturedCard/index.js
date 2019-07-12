import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import styled from '../styled';
import Card, { CardImage, CardContent } from '../Card';
import FlexedView from '../FlexedView';
import { H2, BodyText } from '../typography';
import { withTheme } from '../theme';
import { ButtonIcon } from '../Button';
import { ImageSourceType } from '../ConnectedImage';

const Image = styled({
  aspectRatio: 1,
})(CardImage);

const Content = styled(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'flex-end',
  paddingHorizontal: theme.sizing.baseUnit * 1.5, // TODO: refactor CardContent to have this be the default
  paddingBottom: theme.sizing.baseUnit * 2,
}))(CardContent);

const Description = styled(({ theme }) => ({
  marginTop: theme.sizing.baseUnit,
}))(BodyText);

const ActionButton = withTheme(({ theme }) => ({
  fill: theme.colors.text.primary,
  iconPadding: 10,
  style: {
    marginLeft: theme.sizing.baseUnit,
    backgroundColor: 'salmon',
  },
}))(ButtonIcon);

const MediaCard = ({
  image,
  title,
  actionIcon,
  description,
  onPressAction,
}) => (
  <Card>
    <Image source={image} />

    <Content>
      <FlexedView>
        <H2 numberOfLines={description ? 3 : 4}>{title}</H2>
        {description ? (
          <Description numberOfLines={2}>{description}</Description>
        ) : null}
      </FlexedView>
      {onPressAction ? (
        <ActionButton name={actionIcon} onPress={onPressAction} />
      ) : null}
    </Content>
  </Card>
);

MediaCard.propTypes = {
  image: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]).isRequired,
  title: PropTypes.string.isRequired,
  actionIcon: PropTypes.string,
  description: PropTypes.string,
  onPressAction: PropTypes.func,
};

MediaCard.defaultProps = {
  actionIcon: 'play',
};

MediaCard.displayName = 'MediaCard';

export default MediaCard;
