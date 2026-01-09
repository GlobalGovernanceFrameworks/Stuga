import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Text, Card, ActivityIndicator, FAB, Snackbar } from 'react-native-paper';
import { doc, updateDoc, collection, getDocs, setDoc } from 'firebase/firestore';
import { requestLocationPermission, getCurrentLocation, roundLocationForPrivacy, calculateDistance, formatDistance, getDirection } from '../lib/locationHelpers';
import { signInAnonymously, signInWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../config/firebase';
import { User } from '../types';
import { SkeletonCard } from '../components/SkeletonCard';
import { useBluetooth } from '../hooks/useBluetooth';
import { useOfflineSync } from '../hooks/useOfflineSync';
import { useNetworkState } from '../hooks/useNetworkState';
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

  const [neighbors, setNeighbors] = useState<User[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    authenticateAndLoad();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      updatePendingCount();
    }, [])
  );

  const USE_TEST_ACCOUNT = false; // Toggle this for demos vs development

  async function authenticateAndLoad() {
    try {
      if (USE_TEST_ACCOUNT) {
        await signInWithEmailAndPassword(auth, 'test@stuga.local', 'test1234');
        console.log('🔑 Signed in as test user');
      } else {
        const userCredential = await signInAnonymously(auth);
        console.log('🔑 Your anonymous UID:', userCredential.user.uid);
      }
      await requestAndUpdateLocation(); // Add this
      await loadNeighbors();
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  }

  async function requestAndUpdateLocation() {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      console.warn('Location permission not granted');
      return;
    }

    const location = await getCurrentLocation();
    if (!location) {
      console.warn('Could not get location');
      return;
    }

    const rounded = roundLocationForPrivacy(location.lat, location.lon);
    setUserLocation(rounded);

    // Update location in Firestore
    const user = auth.currentUser;
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        
        // Use setDoc with merge instead of updateDoc
        // This creates the document if it doesn't exist
        await setDoc(userRef, {
          user_id: user.uid,
          name: user.email ? `Testanvändare (${user.email.split('@')[0]})` : 'Testanvändare (Du)',
          bankid_verified: false,
          created_at: Date.now(),
          hearts_balance: 100,
          availability_status: 'available',
          location: {
            lat: rounded.lat,
            lon: rounded.lon,
            accuracy: Math.round(location.accuracy),
            updated_at: Date.now()
          }
        }, { merge: true }); // merge: true only updates fields, doesn't overwrite
        
        console.log('📍 Location updated:', rounded);
      } catch (error) {
        console.error('Error updating location:', error);
      }
    }
  }

  const RADIUS_METERS = 500; // Default radius

  async function loadNeighbors() {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];

      // Filter out current user AND any "Testanvändare" users
      const currentUser = auth.currentUser;
      const filteredUsers = users.filter(user => 
        user.id !== currentUser?.uid &&  // Filter current user
        !user.name.startsWith('Testanvändare')  // Filter any test user names
      );
      
      // Filter by radius and sort by distance if we have user location
      if (userLocation) {
        const filtered = filteredUsers
          .map(user => {
            if (!user.location) return null;
            
            const distance = calculateDistance(
              userLocation.lat,
              userLocation.lon,
              user.location.lat,
              user.location.lon
            );
            
            return { ...user, distance };
          })
          .filter(user => user !== null && user.distance <= RADIUS_METERS)
          .sort((a, b) => a!.distance - b!.distance);
        
        setNeighbors(filtered as User[]);
      } else {
        // No location yet, show all
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
    await requestAndUpdateLocation(); // Update location on refresh
    await loadNeighbors();
    setRefreshing(false);
    showSnackbar('✓ Data uppdaterad', 3000);
  }

  function HeaderSection({ 
    neighborCount, 
    showRadius, 
    onProfilePress 
  }: { 
    neighborCount: number; 
    showRadius: boolean; 
    onProfilePress: () => void;
  }) {
    return (
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>
          🏘️ GRANNAR ({neighborCount}{showRadius ? ` inom ${RADIUS_METERS}m` : ''})
        </Text>
        <Button 
          mode="text" 
          onPress={onProfilePress}
          style={styles.profileButton}
        >
          👤
        </Button>
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

        <HeaderSection 
          neighborCount={neighbors.length}
          showRadius={!!userLocation}
          onProfilePress={() => navigation.navigate('Profile' as never)}
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
                        <Text style={styles.name}>🟢 {item.name}</Text>
                        {viaBluetooth && <Text style={styles.btIcon}>📶</Text>}
                      </View>
                      {distance && (
                        <Text style={styles.distance}>{distance} {direction}</Text>
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
  }
});
