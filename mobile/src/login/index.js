import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
// import { withNavigation } from 'react-navigation';
// import styled from 'ui/styled';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from 'ui/inputs';
import { Button } from 'ui/Button';

const Form = ({ values, touched, errors, handleSubmit }) => (
  <View>
    <TextInput
      label="Email"
      type="email"
      value={values.email}
      error={touched.email && errors.email}
    />
    <TextInput
      label="Password"
      type="password"
      value={values.password}
      error={touched.password && errors.password}
    />
    <Button onPress={handleSubmit} title="Submit" />
  </View>
);

Form.propTypes = {
  touched: PropTypes.shape({}),
  errors: PropTypes.shape({}),
  values: PropTypes.shape({}),
  handleSubmit: PropTypes.func,
};

const LoginForm = withFormik({
  mapPropsToValues: (props) => ({
    email: props.email,
    password: props.password,
  }),

  validationSchema: Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required!'),
    password: Yup.string().required('Password is required!'),
  }),

  handleSubmit: (values) => {
    console.log(values);
  },
})(Form);

export default LoginForm;
