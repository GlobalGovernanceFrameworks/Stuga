import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './src/screens/HomeScreen';
import NeighborDetailScreen from './src/screens/NeighborDetailScreen';
import SendHeartsScreen from './src/screens/SendHeartsScreen';
import AddResourceScreen from './src/screens/AddResourceScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="NeighborDetail" component={NeighborDetailScreen} />
        <Stack.Screen name="SendHearts" component={SendHeartsScreen} />
        <Stack.Screen name="AddResource" component={AddResourceScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
