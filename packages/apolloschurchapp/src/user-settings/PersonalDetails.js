import React, { PureComponent } from 'react';

import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import { Formik } from 'formik';

import FlexedView from 'apolloschurchapp/src/ui/FlexedView';
import PaddedView from 'apolloschurchapp/src/ui/PaddedView';
import { ButtonLink } from 'apolloschurchapp/src/ui/Button';
import { H4 } from 'apolloschurchapp/src/ui/typography';
import styled from 'apolloschurchapp/src/ui/styled';

import updateCurrentUser from './updateCurrentUser';

const Header = styled(({ theme }) => ({
  paddingTop: theme.sizing.baseUnit * 1.75,
  paddingRight: theme.sizing.baseUnit,
  flexDirection: 'row',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  backgroundColor: theme.colors.background.paper,
}))(PaddedView);

const SpaceHolder = styled(() => ({}))(PaddedView);

const DoneButton = styled(() => ({
  fontWeight: '800',
}))(ButtonLink);

class PersonalDetails extends PureComponent {
  static navigationOptions = () => ({
    title: 'Personal Details',
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
      goBack: PropTypes.func,
    }),
  };

  render() {
    return (
      <Mutation
        mutation={updateCurrentUser}
        update={() => {
          // client.mutate({
          //   mutation: getCurrentUser,
          //   variables: {
          //     authToken: authenticate.token,
          //   },
          // });
        }}
      >
        {() => (
          <Formik onSubmit={(values) => console.log(values)}>
            {() => (
              <FlexedView>
                <Header>
                  <SpaceHolder />
                  <H4>Personal Details</H4>
                  <DoneButton onPress={() => this.props.navigation.goBack()}>
                    Done
                  </DoneButton>
                </Header>
              </FlexedView>
            )}
          </Formik>
        )}
      </Mutation>
    );
  }
}

export default PersonalDetails;
