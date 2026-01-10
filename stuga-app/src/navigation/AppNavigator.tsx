import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNetworkState } from '../hooks/useNetworkState';
import HomeScreen from '../screens/HomeScreen';
import NeighborDetailScreen from '../screens/NeighborDetailScreen';
import AddResourceScreen from '../screens/AddResourceScreen';
import EditResourceScreen from '../screens/EditResourceScreen';
import RemoveResourceScreen from '../screens/RemoveResourceScreen';
import SendHeartsScreen from '../screens/SendHeartsScreen';
import HeartsHistoryScreen from '../screens/HeartsHistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MyResourcesScreen from '../screens/MyResourcesScreen';
import ResourcesScreen from '../screens/ResourcesScreen';

const Stack = createNativeStackNavigator();

function HeaderRight() {
  const { isOffline } = useNetworkState();
  
  if (!isOffline) return null;
  
  return (
    <View style={styles.headerRight}>
      <Text style={styles.offlineIndicator}>📡 Offline</Text>
    </View>
  );
}

export default function AppNavigator({ navigationRef }: { navigationRef?: any }) {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#2D5016' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerRight: () => <HeaderRight />
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
          name="EditResource" 
          component={EditResourceScreen}
          options={{ title: 'Redigera resurs' }}
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
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{ title: 'Min profil' }}
        />
        <Stack.Screen 
          name="MyResources" 
          component={MyResourcesScreen}
          options={{ title: 'Mina resurser' }}
        />
        <Stack.Screen 
          name="Resources" 
          component={ResourcesScreen}
          options={{ title: 'Alla resurser' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    marginRight: 12
  },
  offlineIndicator: {
    color: '#FFA500',
    fontSize: 12,
    fontWeight: 'bold'
  }
});
