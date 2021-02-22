import React from 'react';
import PropTypes from 'prop-types';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { Button } from 'react-native';
import FollowListSearch from '.';

const FollowListSearchModal = ({ title }) => {
  const NavStack = createNativeStackNavigator();
  return (
    <NavStack.Navigator
      independent
      initialRouteName="Follow"
      mode="modal"
      screenOptions={{ stackPresentation: 'modal' }}
    >
      <NavStack.Screen
        name="Follow"
        component={FollowListSearch}
        options={({ navigation }) => ({
          title,
          headerRight: function HeaderRight() {
            return <Button title="Done" onPress={() => navigation.goBack()} />;
          },
        })}
      />
    </NavStack.Navigator>
  );
};

FollowListSearchModal.propTypes = {
  title: PropTypes.string,
};

FollowListSearchModal.defaultProps = {
  title: 'Find People to Follow',
};

export default FollowListSearchModal;
