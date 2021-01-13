import 'react-native-gesture-handler';
import React from 'react';

/* Screens */
import Login from './src/components/Login';
import Home from './src/components/Home';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const App: () => React$Node = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" headerMode={false}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default App;

