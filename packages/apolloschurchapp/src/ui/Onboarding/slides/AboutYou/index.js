import React, { memo } from 'react';
import { Image, View } from 'react-native';
import PropTypes from 'prop-types';

import {
  styled,
  H2,
  H5,
  Radio,
  DateInput,
  PaddedView,
} from '@apollosproject/ui-kit';

import Slide from '../../Slide';

const Title = styled(({ theme }) => ({
  color: theme.colors.primary,
  marginBottom: theme.sizing.baseUnit * 0.5,
}))(H2);

const StyledH5 = styled(({ theme }) => ({
  color: theme.colors.text.secondary,
}))(H5);

const StyledImage = styled(({ theme }) => ({
  flex: 3,
  resizeMode: 'contain',
  marginBottom: theme.sizing.baseUnit * 2,
}))(Image);

const Content = styled({
  flex: 1,
  justifyContent: 'center',
})(PaddedView);

const TextContent = styled({
  flex: 1,
  justifyContent: 'center',
})(View);

const AboutYou = memo(
  ({ imgSrc, slideTitle, description, birthday, ...props }) => (
    <Slide {...props}>
      <Content>
        {imgSrc ? <StyledImage source={imgSrc} /> : null}
        <TextContent>
          <Title>{slideTitle}</Title>
          <StyledH5>{description}</StyledH5>
          {/* TODO: getting some warning with this DateInput */}
          {birthday ? (
            <DateInput
              label="Birthday"
              value={birthday}
              displayValue={`${birthday.getMonth() +
                1}/${birthday.getDate()}/${birthday.getFullYear()}`}
            />
          ) : (
            <DateInput label="Birthday" placeholder={'mm/dd/yyyy'} />
          )}
        </TextContent>
      </Content>
    </Slide>
  )
);

AboutYou.propTypes = {
  /* The `Swiper` component used in `<Onboading>` looks for and hijacks the title prop of it's
   * children. Thus we have to use more unique name.
   */
  slideTitle: PropTypes.string,
  description: PropTypes.string,
  imgSrc: PropTypes.string,
  birthday: PropTypes.instanceOf(Date),
};

AboutYou.defaultProps = {
  slideTitle: "This one's easy.",
  description:
    'Help us understand who you are so we can connect you with the best ministries and events.',
};

export default AboutYou;
