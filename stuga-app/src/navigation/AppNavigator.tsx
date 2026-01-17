import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
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
import ContactRequestsScreen from '../screens/ContactRequestsScreen';
import BlockedUsersScreen from '../screens/BlockedUsersScreen';
import BlockCaptainGuideScreen from '../screens/BlockCaptainGuideScreen';
import HelpScreen from '../screens/HelpScreen';

const Stack = createNativeStackNavigator();

function HeaderRight() {
  const { isOffline } = useNetworkState();
  const navigation = useNavigation();
  
  return (
    <View style={styles.headerRight}>
      {isOffline && (
        <Text style={styles.offlineIndicator}>📡 Offline</Text>
      )}
      <IconButton
        icon="help-circle-outline"
        iconColor="#fff"
        size={24}
        onPress={() => navigation.navigate('Help' as never)}
      />
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
        <Stack.Screen 
          name="ContactRequests" 
          component={ContactRequestsScreen}
          options={{ title: 'Kontaktförfrågningar' }}
        />
        <Stack.Screen 
          name="BlockedUsers" 
          component={BlockedUsersScreen}
          options={{ title: 'Blockerade användare' }}
        />
        <Stack.Screen 
          name="BlockCaptainGuide" 
          component={BlockCaptainGuideScreen}
          options={{ title: 'Kvartersvärd - Guide' }}
        />
        <Stack.Screen 
          name="Help" 
          component={HelpScreen}
          options={{ title: 'Hjälp & Guide' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    marginRight: 12
  },
  headerRight: {
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  offlineIndicator: {
    color: '#FFA500',
    fontSize: 12,
    fontWeight: 'bold'
  }
});
