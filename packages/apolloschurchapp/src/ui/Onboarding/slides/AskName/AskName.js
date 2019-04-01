import React, { memo } from 'react';
import PropTypes from 'prop-types';

import {
  styled,
  withTheme,
  Icon,
  H2,
  H5,
  PaddedView,
  TextInput,
} from '@apollosproject/ui-kit';

import Slide from '../../Slide';

const BrandIcon = withTheme(({ theme }) => ({
  name: 'brand-icon',
  size: theme.sizing.baseUnit * 3.0,
  fill: theme.colors.primary,
  style: {
    marginTop: theme.sizing.baseUnit * 2,
    marginBottom: theme.sizing.baseUnit * 0.5,
  },
}))(Icon);

const Title = styled(({ theme }) => ({
  color: theme.colors.primary,
}))(H2);

const StyledH5 = styled(({ theme }) => ({
  color: theme.colors.text.secondary,
}))(H5);

// memo = sfc PureComponent 💥
// eslint-disable-next-line react/display-name
const AskName = memo(
  ({
    onPrimaryPress,
    slideTitle,
    description,
    firstName,
    lastName,
    ...props
  }) => {
    let LastNameInput = null;
    const {
      values,
      touched,
      errors,
      handleSubmit,
      setFieldValue,
      isValid,
      isSubmitting,
    } = props;
    return (
      <Slide {...props}>
        <PaddedView vertical={false}>
          <BrandIcon />
          <Title>{slideTitle}</Title>
          <StyledH5>{description}</StyledH5>
          <TextInput
            label="First Name"
            type="text"
            returnKeyType="next"
            value={values.firstName}
            error={touched.firstName && errors.firstName}
            onChangeText={(text) => setFieldValue('firstName', text)}
            onSubmitEditing={() => LastNameInput.focus()}
            enablesReturnKeyAutomatically
          />
          <TextInput
            label="Last Name"
            type="text"
            returnKeyType="next"
            value={values.lastName}
            error={touched.lastName && errors.lastName}
            onChangeText={(text) => setFieldValue('lastName', text)}
            enablesReturnKeyAutomatically
            inputRef={(r) => {
              LastNameInput = r;
            }}
          />
        </PaddedView>
      </Slide>
    );
  }
);

AskName.propTypes = {
  /* The `Swiper` component used in `<Onboading>` looks for and hijacks the title prop of it's
   * children. Thus we have to use more unique name.
   */
  slideTitle: PropTypes.string,
  description: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  setFieldValue: PropTypes.func,
  touched: PropTypes.shape({}),
  errors: PropTypes.shape({}),
  values: PropTypes.shape({}),
  handleSubmit: PropTypes.func,
  isSubmitting: PropTypes.bool,
  isValid: PropTypes.bool,
  onPrimaryPress: PropTypes.func,
};

AskName.defaultProps = {
  slideTitle: 'Welcome!',
  description: "Every relationship starts with a name. What's yours?",
};

export default AskName;
