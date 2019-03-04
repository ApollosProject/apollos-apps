import React, { memo } from 'react';
import PropTypes from 'prop-types';
import {
  PaddedView,
  FlexedView,
  ProgressiveImage,
  styled,
  H2,
  H5,
  Button,
} from '@apollosproject/ui-kit';

import Slide from '../../Slide';

const ContentWrapper = styled({
  height: '100%',
})(PaddedView);

const Content = styled({
  justifyContent: 'flex-end',
})(FlexedView);

const Title = styled(({ theme }) => ({
  color: theme.colors.primary,
}))(H2);

const StyledH5 = styled(({ theme }) => ({
  color: theme.colors.text.secondary,
  paddingBottom: theme.sizing.baseUnit * 1.5,
}))(H5);

// memo = sfc PureComponent 💥
const AskNotifications = memo(({ slideTitle, description, ...props }) => (
  <Slide {...props}>
    <ContentWrapper vertical={false}>
      <ProgressiveImage
        source={{
          uri: 'https://picsum.photos/640/640/?random',
          height: 320,
          width: 320,
        }}
        // thumbnail={{
        //   uri: 'https://picsum.photos/50/50/?random',
        //   width: 50,
        //   height: 50,
        // }}
        imageStyle={{ width: 320, height: 320 }}
      />
      <Content>
        <Title>{slideTitle}</Title>
        <StyledH5>{description}</StyledH5>
        <Button title={'Yes, enable notifications'} pill={false} />
      </Content>
    </ContentWrapper>
  </Slide>
));

AskNotifications.propTypes = {
  /* The `Swiper` component used in `<Onboading>` looks for and hijacks the title prop of it's
   * children. Thus we have to use more unique name.
   */
  slideTitle: PropTypes.string,
  description: PropTypes.string,
};

AskNotifications.defaultProps = {
  slideTitle: 'Can we keep you informed?',
  description:
    "We'll let you know when important things are happening and keep you in the loop",
  secondaryNavText: 'Later',
};

export default AskNotifications;
