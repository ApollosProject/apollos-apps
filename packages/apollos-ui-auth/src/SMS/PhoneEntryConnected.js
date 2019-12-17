/* eslint-disable react/no-unused-prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { withApollo, Mutation } from 'react-apollo';

import GET_USER_EXISTS from '../getUserExists';
import PhoneEntry from './PhoneEntry';
import REQUEST_PIN from './requestPin';

class PhoneEntryConnected extends Component {
  static propTypes = {
    // Custom component to be rendered. Defaults to PhoneEntry
    Component: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func,
      PropTypes.object, // type check for React fragments
    ]),
    client: PropTypes.shape({
      query: PropTypes.func,
    }),
    screenProps: PropTypes.shape({}), // we'll funnel screenProps into props
  };

  static defaultProps = {
    Component: PhoneEntry,
    screenProps: {},
  };

  validationSchema = Yup.object().shape({
    phone: Yup.string().matches(
      /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/,
      'Your phone number appears to be invalid'
    ),
  });

  flatProps = { ...this.props, ...this.props.screenProps };

  handleOnSubmit = (mutate) => async (
    { phone },
    { setSubmitting, setFieldError }
  ) => {
    setSubmitting(true);
    try {
      const {
        data: { userExists },
      } = await this.props.client.query({
        query: GET_USER_EXISTS,
        variables: { identity: phone },
        fetchPolicy: 'network-only',
      });

      if (userExists === 'EXISTING_APP_USER') {
        await mutate({ variables: { phone } });
        this.props.navigation.navigate('AuthSMSVerificationConnected', {
          phone,
        });
      } else {
        this.props.navigation.navigate('AuthProfileEntryConnected', {
          phone,
        });
      }
    } catch (e) {
      setFieldError(
        'phone',
        'There was an error. Please double check your number and try again.'
      );
    }
    setSubmitting(false);
  };

  handleOnPressAlternateLogin = () => {
    this.props.navigation.replace('AuthEmailEntryConnected');
  };

  render() {
    return (
      <Mutation mutation={REQUEST_PIN}>
        {(mutate) => (
          <Formik
            initialValues={{ phone: '' }}
            validationSchema={this.validationSchema}
            onSubmit={this.handleOnSubmit(mutate)}
          >
            {({
              setFieldValue,
              handleSubmit,
              values,
              isSubmitting,
              isValid,
              touched,
              errors,
            }) => (
              <this.props.Component
                disabled={isSubmitting || !isValid}
                errors={touched.phone && errors}
                isLoading={isSubmitting}
                onPressNext={handleSubmit}
                onPressAlternateLogin={this.handleOnPressAlternateLogin}
                setFieldValue={setFieldValue}
                values={values}
                {...this.flatProps}
              />
            )}
          </Formik>
        )}
      </Mutation>
    );
  }
}

export default withApollo(PhoneEntryConnected);
