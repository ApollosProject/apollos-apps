import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { named, styled, useTheme } from '@apollosproject/ui-kit';
import { SharedElement } from 'react-navigation-shared-element';

const OuterContainer = styled({
  height: '100%',
  width: '80%',
  overflow: 'hidden',
})(View);

const Container = styled({
  aspectRatio: 307 / 642,
  width: '85%', // these percentages have to match
  marginTop: '12.5%', // offset the "notch"
})(View);

const Positioner = styled({
  ...StyleSheet.absoluteFillObject,
  alignItems: 'center',
})(View);

const styles = StyleSheet.create({
  svg: { width: '100%', aspectRatio: 307 / 642 },
});

const PhoneOutline = ({ children, fill }) => {
  const theme = useTheme();
  return (
    <OuterContainer>
      <SharedElement id="phone-outline" style={StyleSheet.absoluteFill}>
        <Svg style={styles.svg} viewBox="0 0 307 642">
          <Path
            d="M40.6133 0.807861H266.387C288.366 0.807861 306.184 18.6415 306.184 40.6404V601.36C306.184 623.358 288.366 641.192 266.387 641.192H40.6133C18.6338 641.192 0.815918 623.358 0.815918 601.36V40.6404C0.815918 18.6415 18.6338 0.807861 40.6133 0.807861ZM40.6133 9.99998C23.706 9.99998 9.99992 23.7182 9.99992 40.6404V601.36C9.99992 618.282 23.706 632 40.6133 632H266.387C283.294 632 297 618.282 297 601.36V40.6404C297 23.7182 283.294 9.99998 266.387 9.99998H40.6133Z"
            fill={fill || theme.colors.background.system}
          />
          <Path
            d="M91.1553 33.7463H215.845C225.567 33.7463 233.447 25.8584 233.447 16.1281C233.447 16.1193 233.443 13.7457 233.443 13.2025C233.442 13.1288 233.454 13.0567 233.479 12.9874V12.9874C233.988 11.5879 235.17 10.518 236.622 10.1656L237.304 10H69.696L70.3786 10.1656C71.8234 10.5163 73.0125 11.598 73.5261 12.9874V12.9874C73.5514 13.0559 73.5577 13.1296 73.5575 13.2027L73.5526 16.0982C73.5526 25.8584 81.4336 33.7463 91.1553 33.7463Z"
            fill={fill || theme.colors.background.system}
          />
        </Svg>
      </SharedElement>
      <Positioner>
        <Container>{children}</Container>
      </Positioner>
    </OuterContainer>
  );
};

PhoneOutline.propTypes = {
  children: PropTypes.node,
  fill: PropTypes.string,
};

export default named('ui-onboarding.LandingSwiper.PhoneOutline')(PhoneOutline);
