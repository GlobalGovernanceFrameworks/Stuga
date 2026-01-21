import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Text, Card, ActivityIndicator, FAB, Snackbar } from 'react-native-paper';
import { doc, updateDoc, collection, getDocs, setDoc } from 'firebase/firestore';
import { getBlockedUsers } from '../lib/blockHelpers';
import { requestLocationPermission, getCurrentLocation, roundLocationForPrivacy, calculateDistance, formatDistance, getDirection, formatDistanceFuzzy } from '../lib/locationHelpers';
import { db, auth } from '../config/firebase';
import { User } from '../types';
import { SkeletonCard } from '../components/SkeletonCard';
import { useBluetooth } from '../hooks/useBluetooth';
import { useOfflineSync } from '../hooks/useOfflineSync';
import { useNetworkState } from '../hooks/useNetworkState';
import { useNotifications } from '../hooks/useNotifications';
import { useSnackbar } from '../hooks/useSnackbar';

export default function HomeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { isConnected, isOffline } = useNetworkState();
  const { syncing, pendingCount, performSync, updatePendingCount } = useOfflineSync();
  // const { isInitialized: btInitialized, isScanning: btScanning, nearbyDevices } = useBluetooth();
  const btInitialized = false;
  const btScanning = false;
  const nearbyDevices = 0;
  const { visible, message, duration, showSnackbar, hideSnackbar } = useSnackbar();
  const { expoPushToken } = useNotifications();

  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [neighbors, setNeighbors] = useState<User[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Run ONCE on mount
  useEffect(() => {
    authenticateAndLoad();
  }, []);

  // Run when expoPushToken changes
  useEffect(() => {
    if (expoPushToken && auth.currentUser) {
      saveExpoPushToken(expoPushToken);
    }
  }, [expoPushToken]);

  async function saveExpoPushToken(token: string) {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await updateDoc(doc(db, 'users', user.uid), {
        fcm_token: token,
        fcm_token_updated_at: Date.now()
      });
      
      console.log('✅ Push token saved to Firestore');
    } catch (error) {
      console.error('Error saving push token:', error);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      updatePendingCount();
    }, [])
  );

  async function authenticateAndLoad() {
    try {
      // User is already authenticated in App.tsx

      // Get location FIRST
      const location = await requestAndUpdateLocation();
      
      // Then load neighbors with that location
      await loadNeighbors(location);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  }

  async function requestAndUpdateLocation() {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      console.warn('Location permission not granted');
      return null; // NEW - return null if no permission
    }

    const location = await getCurrentLocation();
    if (!location) {
      console.warn('Could not get location');
      return null; // NEW - return null if no location
    }

    const rounded = roundLocationForPrivacy(location.lat, location.lon);
    setUserLocation(rounded); // This updates state

    // Update location in Firestore
    const user = auth.currentUser;
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        
        await updateDoc(userRef, {
          location: {
            lat: rounded.lat,
            lon: rounded.lon,
            accuracy: Math.round(location.accuracy),
            updated_at: Date.now()
          }
        });
        
        console.log('📍 Location updated:', rounded);
      } catch (error) {
        console.error('Error updating location:', error);
      }
    }
    
    return rounded; // NEW - return the location
  }

  const RADIUS_METERS = 500; // Default radius

  async function loadNeighbors(forceLocation?: { lat: number; lon: number } | null) {
    try {
      const currentUser = auth.currentUser;
      
      // Get blocked users
      const blocked = await getBlockedUsers(currentUser?.uid || '');
      console.log('🚫 Blocked user IDs:', blocked);
      setBlockedUsers(blocked);
      
      const snapshot = await getDocs(collection(db, 'users'));
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];

      console.log('👥 Total users from Firestore:', users.length);

      // Filter out current user, test users, AND blocked users
      const filteredUsers = users.filter(user => 
        user.id !== currentUser?.uid &&
        !user.name.startsWith('Testanvändare') &&
        !blocked.includes(user.user_id)
      );
      
      console.log('✅ Filtered users to show:', filteredUsers.length);
      
      // Use provided location OR state location
      const locationToUse = forceLocation !== undefined ? forceLocation : userLocation;
      
      // Filter by radius and sort by distance if we have location
      if (locationToUse) {
        console.log('📍 Using location:', locationToUse);
        console.log('📏 RADIUS_METERS:', RADIUS_METERS);
        
        const filtered = filteredUsers
          .map(user => {
            if (!user.location) {
              console.log(`⚠️  ${user.name} has NO LOCATION DATA`);
              return null;
            }
            
            const distance = calculateDistance(
              locationToUse.lat,
              locationToUse.lon,
              user.location.lat,
              user.location.lon
            );
            
            console.log(`📏 Distance to ${user.name}: ${Math.round(distance)}m`, {
              userLoc: user.location,
              distance: Math.round(distance),
              withinRadius: distance <= RADIUS_METERS
            });
            
            return { ...user, distance };
          })
          .filter(user => user !== null && user.distance <= RADIUS_METERS)
          .sort((a, b) => a!.distance - b!.distance);
        
        console.log('✅ After distance filter:', filtered.length, 'users');
        setNeighbors(filtered as User[]);
      } else {
        // No location available - show all (fallback)
        console.log('⚠️  No location available, showing all users');
        setNeighbors(filteredUsers);
      }
    } catch (error) {
      console.error('Error loading neighbors:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    const location = await requestAndUpdateLocation();
    await loadNeighbors(location); // Pass fresh location
    setRefreshing(false);
    showSnackbar('✓ Data uppdaterad', 3000);
  }

  async function openAppSettings() {
    try {
      if (Platform.OS === 'ios') {
        await Linking.openURL('app-settings:');
      } else {
        await Linking.openSettings();
      }
    } catch (error) {
      console.error('Could not open settings:', error);
      showSnackbar('Kunde inte öppna inställningar. Öppna manuellt och leta upp Stuga.', 5000);
    }
  }

  async function retryLocation() {
    setLocationError(null);
    setLoading(true);
    const location = await requestAndUpdateLocation();
    await loadNeighbors(location);
    setLoading(false);
  }

  function HeaderSection({ 
    neighborCount, 
    showRadius, 
    onProfilePress,
    onResourcesPress
  }: { 
    neighborCount: number; 
    showRadius: boolean; 
    onProfilePress: () => void;
    onResourcesPress: () => void;
  }) {
    return (
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>
          🏘️ GRANNAR ({neighborCount}{showRadius ? ` inom ${RADIUS_METERS}m` : ''})
        </Text>
        <View style={styles.headerButtons}>
          <Button 
            mode="text" 
            onPress={onResourcesPress}
            icon="view-list"
            textColor="#2D5016"
            compact
          >
            Resurser
          </Button>
          <Button 
            mode="text" 
            onPress={onProfilePress}
            compact
          >
            👤
          </Button>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F3F0' }}>
        <View style={styles.container}>
          <HeaderSection 
            neighborCount={neighbors.length}
            showRadius={!!userLocation}
            onProfilePress={() => navigation.navigate('Profile' as never)}
          />
          {[1, 2, 3, 4, 5].map(i => (
            <SkeletonCard key={i} />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F3F0' }}>
      <View style={styles.container}>
        {isOffline && (
          <Card style={styles.offlineCard}>
            <Card.Content>
              <Text style={styles.offlineText}>
                📡 Offline-läge {pendingCount > 0 && `(${pendingCount} väntande)`}
              </Text>
            </Card.Content>
          </Card>
        )}
        
        {syncing && (
          <Card style={styles.syncCard}>
            <Card.Content>
              <Text style={styles.syncText}>
                🔄 Synkroniserar {pendingCount} transaktioner...
              </Text>
            </Card.Content>
          </Card>
        )}

        {btInitialized && btScanning && (
          <Card style={styles.bluetoothCard}>
            <Card.Content>
              <Text style={styles.bluetoothText}>
                📶 Bluetooth aktiv · {nearbyDevices} enheter i närheten
              </Text>
            </Card.Content>
          </Card>
        )}

        {locationError && (
          <Card style={styles.locationErrorCard}>
            <Card.Content>
              <View style={styles.errorHeader}>
                <Text style={styles.errorIcon}>📍</Text>
                <Text style={styles.errorTitle}>Platsåtkomst krävs</Text>
              </View>
              <Text style={styles.errorText}>{locationError}</Text>
              <View style={styles.errorActions}>
                <Button
                  mode="contained"
                  onPress={retryLocation}
                  style={styles.errorButton}
                  buttonColor="#2D5016"
                  icon="refresh"
                >
                  Försök igen
                </Button>
                <Button
                  mode="outlined"
                  onPress={openAppSettings}
                  style={styles.errorButton}
                  icon="cog"
                >
                  Inställningar
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}

        <HeaderSection 
          neighborCount={neighbors.length}
          showRadius={!!userLocation}
          onProfilePress={() => navigation.navigate('Profile' as never)}
          onResourcesPress={() => navigation.navigate('Resources' as never)}
        />

        {neighbors.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🏘️</Text>
            <Text style={styles.emptyTitle}>Inga grannar hittade</Text>
            <Text style={styles.emptyText}>
              Det verkar inte finnas några grannar i närheten som använder Stuga än.
            </Text>
            <Button
              mode="contained"
              onPress={loadNeighbors}
              style={{ marginTop: 16 }}
              buttonColor="#2D5016"
              textColor="#fff"
            >
              Uppdatera
            </Button>
          </View>
        ) : (      
          <FlatList
            data={neighbors}
            keyExtractor={item => item.id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#2D5016']}
              />
            }
            renderItem={({ item }) => {
              // Calculate distance if we have user location
              let distance = null;
              let direction = null;
              let viaBluetooth = false;
              
              if (userLocation && item.location) {
                const distanceMeters = (item as any).distance || calculateDistance(
                  userLocation.lat,
                  userLocation.lon,
                  item.location.lat,
                  item.location.lon
                );
                distance = formatDistance(distanceMeters);
                direction = getDirection(
                  userLocation.lat,
                  userLocation.lon,
                  item.location.lat,
                  item.location.lon
                );
                
                // Check if this neighbor was discovered via Bluetooth
                // (distance < 50m typically means Bluetooth range)
                viaBluetooth = distanceMeters < 50 && btScanning;
              }

              return (
                <Card 
                  style={styles.card}
                  onPress={() => navigation.navigate('NeighborDetail', { neighbor: item })}
                >
                  <Card.Content>
                    <View style={styles.cardHeader}>
                      <View style={styles.nameRow}>
                        <Text style={styles.name}>
                          {item.is_block_captain && '🛡️ '}🟢 {item.display_name || item.name}
                        </Text>
                        {viaBluetooth && <Text style={styles.btIcon}>📶</Text>}
                      </View>
                      {distance && (
                        <Text style={styles.distance}>{formatDistanceFuzzy(item.distance)}</Text>
                      )}
                    </View>
                    <Text style={styles.hearts}>🔥 {item.hearts_balance} Hearts</Text>
                  </Card.Content>
                </Card>
              );
            }}
          />
        )}

        {btInitialized && (
          <Card style={styles.meshStatusCard}>
            <Card.Content>
              <Text style={styles.meshTitle}>Bluetooth mesh-nätverk</Text>
              <Text style={styles.meshStatus}>
                {btScanning ? '🟢 Aktiv' : '🔴 Inaktiv'} · {nearbyDevices} grannar upptäckta
              </Text>
              {nearbyDevices > 0 && (
                <Text style={styles.meshHint}>
                  📶 Grannar inom Bluetooth-räckvidd (~50m) markeras med 📶
                </Text>
              )}
            </Card.Content>
          </Card>
        )}

        <View style={[styles.buttonRow, { bottom: insets.bottom + 96 }]}>
          <Button
            mode="outlined"
            icon="heart"
            onPress={() => navigation.navigate('HeartsHistory')}
            style={styles.buttonHalf}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            textColor="#2D5016"
          >
            Hearts
          </Button>
          
          {pendingCount > 0 && (
            <Button
              mode="outlined"
              icon="sync"
              onPress={performSync}
              loading={syncing}
              disabled={syncing || isOffline}
              style={styles.buttonHalf}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              textColor="#FF6B35"
            >
              Synka ({pendingCount})
            </Button>
          )}
        </View>
        <View style={[styles.fabContainer, { bottom: insets.bottom + 16 }]}>
          <Button
            mode="contained"
            icon="plus"
            onPress={() => navigation.navigate('AddResource')}
            style={styles.fabButton}
            buttonColor="#2D5016"
            textColor="#fff"
            contentStyle={styles.fabContent}
          >
            Lägg till
          </Button>
          
          <Button
            mode="contained"
            icon="view-list"
            onPress={() => navigation.navigate('MyResources')}
            style={styles.fabButton}
            buttonColor="#6BCF7F"
            textColor="#fff"
            contentStyle={styles.fabContent}
          >
            Mina resurser
          </Button>
        </View>
      </View>
      <Snackbar
        visible={visible}
        onDismiss={hideSnackbar}
        duration={duration}
        style={{ backgroundColor: '#2D5016' }}
      >
        {message}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  offlineCard: {
    marginBottom: 12,
    backgroundColor: '#FFF4E6'
  },
  offlineText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  syncCard: {
    marginBottom: 12,
    backgroundColor: '#E1F5DD'
  },
  syncText: {
    fontSize: 14,
    color: '#2D5016',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  bluetoothCard: {
    marginBottom: 12,
    backgroundColor: '#E8F4F8'
  },
  bluetoothText: {
    fontSize: 12,
    color: '#0066CC',
    textAlign: 'center'
  },
  container: {
    flex: 1,
    padding: 16
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D5016',
    flex: 1
  },
  profileButton: {
    minWidth: 40
  },
  card: {
    marginBottom: 12,
    backgroundColor: '#fff'
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 8
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20
  },
  hearts: {
    fontSize: 14,
    color: '#666'
  },
  buttonRow: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
    zIndex: 1
  },
  buttonHalf: {
    flex: 1,
    borderColor: '#2D5016'
  },
  buttonContent: {
    paddingVertical: 4
  },
  buttonLabel: {
    fontSize: 12
  },
  fabContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 12,
    zIndex: 1
  },
  fabButton: {
    flex: 1
  },
  fabContent: {
    paddingVertical: 8
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  distance: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold'
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  btIcon: {
    fontSize: 14
  },
  meshStatusCard: {
    marginTop: 16,
    marginBottom: 120,
    backgroundColor: '#F0F8FF'
  },
  meshTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 4
  },
  meshStatus: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4
  },
  meshHint: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic'
  },
  locationErrorCard: {
    marginBottom: 12,
    backgroundColor: '#FFF4E6',
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35'
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  errorIcon: {
    fontSize: 24,
    marginRight: 8
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D5016'
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12
  },
  errorActions: {
    flexDirection: 'row',
    gap: 8
  },
  errorButton: {
    flex: 1
  },
});
