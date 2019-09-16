import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import PropTypes from 'prop-types';

// import { track, events } from 'apolloschurchapp/src/analytics';
import {
  FlexedView,
  PaddedView,
  TextInput,
  Button,
  ButtonLink,
  styled,
} from '@apollosproject/ui-kit';

const Footer = styled({
  flex: 1,
  justifyContent: 'flex-end',
})(SafeAreaView);

class Form extends PureComponent {
  static propTypes = {
    setFieldValue: PropTypes.func,
    touched: PropTypes.shape({
      email: PropTypes.string,
      password: PropTypes.string,
    }),
    errors: PropTypes.shape({
      email: PropTypes.string,
      password: PropTypes.string,
    }),
    values: PropTypes.shape({
      email: PropTypes.string,
      password: PropTypes.string,
    }),
    handleSubmit: PropTypes.func,
    isSubmitting: PropTypes.bool,
    isValid: PropTypes.bool,
    handleForgotPassword: PropTypes.func,
  };

  render() {
    const {
      values,
      touched,
      errors,
      handleSubmit,
      setFieldValue,
      isValid,
      isSubmitting,
    } = this.props;
    return (
      <FlexedView>
        <PaddedView>
          <View>
            <TextInput
              label="Email"
              type="email"
              value={values.email}
              error={touched.email && errors.email}
              onChangeText={(text) => setFieldValue('email', text)}
              onSubmitEditing={() => this.passwordInput.focus()}
              returnKeyType="next"
              textContentType="username"
              enablesReturnKeyAutomatically
            />
            <TextInput
              label="Password"
              type="password"
              value={values.password}
              error={touched.password && errors.password}
              onChangeText={(text) => setFieldValue('password', text)}
              onSubmitEditing={handleSubmit}
              returnKeyType="go"
              textContentType="password"
              enablesReturnKeyAutomatically
              inputRef={(r) => {
                this.passwordInput = r;
              }}
            />
            {this.props.handleForgotPassword ? (
              <ButtonLink onPress={this.props.handleForgotPassword}>
                Forgot your password?
              </ButtonLink>
            ) : null}
          </View>
        </PaddedView>
        <Footer>
          <PaddedView vertical={false}>
            <Button
              onPress={handleSubmit}
              title="Sign in"
              disabled={!isValid}
              loading={isSubmitting}
            />
          </PaddedView>
        </Footer>
      </FlexedView>
    );
  }
}

export default Form;
