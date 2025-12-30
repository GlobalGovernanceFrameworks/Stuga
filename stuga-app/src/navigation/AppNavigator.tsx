import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import NeighborDetailScreen from '../screens/NeighborDetailScreen';
import AddResourceScreen from '../screens/AddResourceScreen';
import RemoveResourceScreen from '../screens/RemoveResourceScreen';
import SendHeartsScreen from '../screens/SendHeartsScreen';
import HeartsHistoryScreen from '../screens/HeartsHistoryScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#2D5016' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Stuga - Grannkarta' }}
        />
        <Stack.Screen 
          name="NeighborDetail" 
          component={NeighborDetailScreen}
          options={{ title: 'Granndetaljer' }}
        />
        <Stack.Screen 
          name="AddResource" 
          component={AddResourceScreen}
          options={{ title: 'Lägg till resurs' }}
        />
        <Stack.Screen 
          name="RemoveResource" 
          component={RemoveResourceScreen}
          options={{ title: 'Ta bort resurs' }}
        />
        <Stack.Screen 
          name="SendHearts" 
          component={SendHeartsScreen}
          options={{ title: 'Skicka Hearts' }}
        />
        <Stack.Screen 
          name="HeartsHistory" 
          component={HeartsHistoryScreen}
          options={{ title: 'Hearts Historik' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
