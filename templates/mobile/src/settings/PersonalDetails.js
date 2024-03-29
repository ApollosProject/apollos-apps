import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Query, Mutation } from '@apollo/client/react/components';
import { Formik } from 'formik';
import * as Yup from 'yup';

import {
  BackgroundView,
  TextInput,
  PaddedView,
  Button,
  styled,
} from '@apollosproject/ui-kit';

import { GET_USER_PROFILE } from '@apollosproject/ui-connected';

import UPDATE_CURRENT_USER from './updateCurrentUser';

const FlexedKeyboardAvoidingView = styled({
  flex: 1,
})(KeyboardAvoidingView);

const Footer = styled(({ theme }) => ({
  flex: 1,
  justifyContent: 'flex-end',
  marginBottom: theme.sizing.baseUnit * 5,
}))(SafeAreaView);

class PersonalDetails extends PureComponent {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
      goBack: PropTypes.func,
    }),
  };

  renderForm = (props) => (
    // have to add the offset to account for @react-navigation/native header
    <BackgroundView avoidHeader>
      <FlexedKeyboardAvoidingView behavior="padding">
        <PaddedView>
          <TextInput
            label="First Name"
            type="text"
            value={props.values.firstName}
            error={props.touched.firstName && props.errors.firstName}
            onChangeText={(text) => props.setFieldValue('firstName', text)}
          />
          <TextInput
            label="Last Name"
            type="text"
            value={props.values.lastName}
            error={props.touched.lastName && props.errors.lastName}
            onChangeText={(text) => props.setFieldValue('lastName', text)}
          />
        </PaddedView>
        <Footer>
          <PaddedView>
            <Button
              disabled={props.isSubmitting}
              onPress={props.handleSubmit}
              title="Save"
              loading={props.isSubmitting}
            />
          </PaddedView>
        </Footer>
      </FlexedKeyboardAvoidingView>
    </BackgroundView>
  );

  render() {
    return (
      <Query query={GET_USER_PROFILE} fetchPolicy="cache-and-network">
        {({ data }) => {
          if (data) {
            const { currentUser } = data;
            const { firstName, lastName } = data.currentUser.profile;

            return (
              <Mutation
                mutation={UPDATE_CURRENT_USER}
                update={async (cache, { data: { updateProfileFields } }) => {
                  await cache.writeQuery({
                    query: GET_USER_PROFILE,
                    data: {
                      currentUser: {
                        ...currentUser,
                        profile: {
                          ...currentUser.profile,
                          firstName: updateProfileFields.firstName,
                          lastName: updateProfileFields.lastName,
                        },
                      },
                    },
                  });
                }}
              >
                {(updateDetails) => (
                  <Formik
                    initialValues={{ firstName, lastName }}
                    validationSchema={Yup.object().shape({
                      firstName: Yup.string()
                        .required('First Name is required!')
                        .nullable(),
                      lastName: Yup.string()
                        .required('Last Name is required!')
                        .nullable(),
                    })}
                    onSubmit={async (
                      variables,
                      { setSubmitting, setFieldError }
                    ) => {
                      try {
                        await updateDetails({ variables });
                        await this.props.navigation.goBack();
                      } catch (e) {
                        const { graphQLErrors } = e;
                        if (
                          graphQLErrors.length &&
                          graphQLErrors.find(({ message }) =>
                            message.includes('User already exists')
                          )
                        ) {
                          setFieldError(
                            'personal_details',
                            'Unknown error. Please try again later.'
                          );
                        }
                      }
                      setSubmitting(false);
                    }}
                  >
                    {this.renderForm}
                  </Formik>
                )}
              </Mutation>
            );
          }
          return null;
        }}
      </Query>
    );
  }
}

export default PersonalDetails;
