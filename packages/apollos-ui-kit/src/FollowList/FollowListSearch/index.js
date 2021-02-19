import React from 'react';
import PropTypes from 'prop-types';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { Button } from 'react-native';
import FollowList from '..';
import H4 from '../../typography/H4';

const NavStack = createNativeStackNavigator();

function FollowListScreen() {
  return (
    <FollowList
      header={<H4>Followers</H4>}
      followers={[
        {
          id: 'fakeId1',
          request: true,
          firstName: 'Joshua',
          lastName: 'Imel',
          parentChannel: {
            id: 'ContentChannel:be35f49307d7297989d3514be788ef2d',
            name: 'NewSpring - Articles',
          },
          image: {
            sources: [
              {
                uri: 'https://picsum.photos/600/400?random',
              },
            ],
          },
        },
      ]}
    />
  );
}

const FollowListSearch = ({ title }) => {
  return (
    <NavStack.Navigator
      initialRouteName="Follow"
      mode="float"
      screenOptions={{ stackPresentation: 'modal' }}
    >
      <NavStack.Screen
        name="Follow"
        component={FollowListScreen}
        options={{
          title,
          headerRight: function HeaderRight() {
            return <Button title="Test" />;
          },
        }}
      />
    </NavStack.Navigator>
  );
};

FollowListSearch.propTypes = {
  title: PropTypes.string,
};

FollowListSearch.defaultProps = {
  title: 'Find People to Follow',
};

export default FollowListSearch;
