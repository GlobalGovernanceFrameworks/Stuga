import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Searchbar, Chip, SegmentedButtons } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { Resource, User } from '../types';
import { getCategoryLabel } from '../lib/categoryHelpers';
import { UrgencyBadge } from '../components/UrgencyBadge';
import { SkeletonCard } from '../components/SkeletonCard';
import { isExpired, getUrgencyLevel } from '../lib/expiryHelpers';
import { calculateDistance, formatDistance, getDirection } from '../lib/locationHelpers';

const CATEGORIES = [
  { key: 'alla', label: 'Alla' },
  { key: 'mat', label: 'Mat 🥪' },
  { key: 'värme', label: 'Värme 🔥' },
  { key: 'verktyg', label: 'Verktyg 🔨' },
  { key: 'transport', label: 'Transport 🚗' },
  { key: 'kunskap', label: 'Kunskap 📚' },
  { key: 'boende', label: 'Boende 🏠' },
  { key: 'första_hjälpen', label: 'Första hjälpen ⚕️' },
  { key: 'annat', label: 'Annat' }
];

type ResourceWithOwner = Resource & {
  ownerName: string;
  ownerLocation?: { lat: number; lon: number };
  distance?: number;
};

export default function ResourcesScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [resources, setResources] = useState<ResourceWithOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('alla');
  const [resourceType, setResourceType] = useState<'all' | 'offer' | 'need'>('all');
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      loadResources();
    }, [])
  );

  async function loadResources() {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      // Get current user's location
      const userDoc = await getDocs(collection(db, 'users'));
      const currentUserData = userDoc.docs.find(doc => doc.data().user_id === currentUser.uid);
      if (currentUserData?.data().location) {
        setUserLocation(currentUserData.data().location);
      }

      // Get all resources
      const resourcesSnapshot = await getDocs(collection(db, 'resources'));
      const resourcesData = resourcesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Resource[];

      // Get all users to match owner names
      const usersData = userDoc.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];

      // Combine resources with owner info
      const enrichedResources: ResourceWithOwner[] = resourcesData
        .filter(r => !isExpired(r.expires_at)) // Hide expired
        .filter(r => r.user_id !== currentUser.uid) // Hide own resources
        .map(resource => {
          const owner = usersData.find(u => u.user_id === resource.user_id);
          let distance;
          
          if (userLocation && owner?.location) {
            distance = calculateDistance(
              userLocation.lat,
              userLocation.lon,
              owner.location.lat,
              owner.location.lon
            );
          }

          return {
            ...resource,
            ownerName: owner?.name || 'Okänd användare',
            ownerLocation: owner?.location,
            distance
          };
        });

      // Sort by urgency first, then distance
      enrichedResources.sort((a, b) => {
        const urgencyA = getUrgencyLevel(a.expires_at);
        const urgencyB = getUrgencyLevel(b.expires_at);
        
        const urgencyOrder = { urgent: 0, soon: 1, available: 2 };
        const urgencyDiff = urgencyOrder[urgencyA] - urgencyOrder[urgencyB];
        
        if (urgencyDiff !== 0) return urgencyDiff;
        
        // If same urgency, sort by distance
        if (a.distance && b.distance) {
          return a.distance - b.distance;
        }
        return 0;
      });

      setResources(enrichedResources);
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setLoading(false);
    }
  }

  // Filter resources based on search, category, and type
  const filteredResources = resources.filter(resource => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.ownerName.toLowerCase().includes(query);
      
      if (!matchesSearch) return false;
    }

    // Category filter
    if (selectedCategory !== 'alla' && resource.category !== selectedCategory) {
      return false;
    }

    // Type filter
    if (resourceType === 'offer' && resource.type !== 'offer') return false;
    if (resourceType === 'need' && resource.type !== 'need') return false;

    return true;
  });

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F3F0' }}>
        <View style={styles.container}>
          <Text style={styles.header}>Alla resurser</Text>
          {[1, 2, 3, 4].map(i => (
            <SkeletonCard key={i} />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F3F0' }}>
      <View style={styles.container}>
        <Text style={styles.header}>Alla resurser</Text>

        {/* Search bar */}
        <Searchbar
          placeholder="Sök resurser..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        {/* Type filter */}
        <Card style={styles.filterCard}>
          <Card.Content>
            <SegmentedButtons
              value={resourceType}
              onValueChange={(value) => setResourceType(value as any)}
              buttons={[
                { value: 'all', label: 'Alla', icon: 'view-list' },
                { value: 'offer', label: 'Erbjuder', icon: 'arrow-up' },
                { value: 'need', label: 'Behöver', icon: 'arrow-down' }
              ]}
            />
          </Card.Content>
        </Card>

        {/* Category chips */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {CATEGORIES.map(cat => (
            <Chip
              key={cat.key}
              selected={selectedCategory === cat.key}
              onPress={() => setSelectedCategory(cat.key)}
              style={styles.chip}
              selectedColor="#2D5016"
              mode={selectedCategory === cat.key ? 'flat' : 'outlined'}
            >
              {cat.label}
            </Chip>
          ))}
        </ScrollView>

        {/* Results count */}
        <Text style={styles.resultsCount}>
          {filteredResources.length} resurser
          {searchQuery && ` för "${searchQuery}"`}
        </Text>

        {/* Resources list */}
        {filteredResources.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={styles.emptyTitle}>Inga resurser hittades</Text>
              <Text style={styles.emptyText}>
                {searchQuery 
                  ? `Inga resurser matchade "${searchQuery}"`
                  : 'Inga resurser i denna kategori'}
              </Text>
            </Card.Content>
          </Card>
        ) : (
          <FlatList
            data={filteredResources}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
            renderItem={({ item }) => {
              const owner = { name: item.ownerName, user_id: item.user_id };
              
              return (
                <Card 
                  style={styles.resourceCard}
                  onPress={() => navigation.navigate('NeighborDetail', { 
                    neighbor: { 
                      name: item.ownerName, 
                      user_id: item.user_id,
                      // Pass minimal data needed for NeighborDetail
                    } 
                  })}
                >
                  <Card.Content>
                    <View style={styles.resourceHeader}>
                      <UrgencyBadge expiresAt={item.expires_at} showTimeRemaining />
                      <Text style={styles.typeIcon}>
                        {item.type === 'offer' ? '📤' : '📥'}
                      </Text>
                    </View>
                    
                    <Text style={styles.resourceTitle}>{item.title}</Text>
                    
                    <View style={styles.ownerRow}>
                      <Text style={styles.ownerName}>🟢 {item.ownerName}</Text>
                      {item.distance && userLocation && (
                        <Text style={styles.distance}>
                          {formatDistance(item.distance)} {getDirection(
                            userLocation.lat,
                            userLocation.lon,
                            item.ownerLocation!.lat,
                            item.ownerLocation!.lon
                          )}
                        </Text>
                      )}
                    </View>
                    
                    <Text style={styles.category}>
                      {getCategoryLabel(item.category)}
                    </Text>
                    
                    {item.description && (
                      <Text style={styles.description} numberOfLines={2}>
                        {item.description}
                      </Text>
                    )}
                  </Card.Content>
                </Card>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2D5016'
  },
  searchbar: {
    marginBottom: 16,
    backgroundColor: '#fff'
  },
  filterCard: {
    marginBottom: 16,
    backgroundColor: '#fff'
  },
  categoryScroll: {
    marginBottom: 12,
    maxHeight: 50
  },
  categoryContainer: {
    paddingRight: 16,
    paddingVertical: 0
  },
  chip: {
    marginRight: 8,
    minHeight: 42
  },
  resultsCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontWeight: 'bold'
  },
  resourceCard: {
    marginBottom: 12,
    backgroundColor: '#fff'
  },
  resourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  typeIcon: {
    fontSize: 20
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2D5016'
  },
  ownerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  ownerName: {
    fontSize: 14,
    color: '#2D5016',
    fontWeight: '600'
  },
  distance: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold'
  },
  category: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4
  },
  emptyCard: {
    marginTop: 32,
    backgroundColor: '#FFF4E6'
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 32
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 8
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 32
  }
});
