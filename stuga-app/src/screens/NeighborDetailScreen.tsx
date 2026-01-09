import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Linking, Alert, View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Card, Button, ActivityIndicator } from 'react-native-paper';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { Resource } from '../types';
import { getCategoryLabel } from '../lib/categoryHelpers';
import { SkeletonCard } from '../components/SkeletonCard';
import { StatusBadge } from '../components/StatusBadge';
import { UrgencyBadge } from '../components/UrgencyBadge';
import { isExpired } from '../lib/expiryHelpers';

export default function NeighborDetailScreen({ route, navigation }: any) {
  const { neighbor } = route.params;
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();
  const currentUser = auth.currentUser;
  const isMe = currentUser?.uid === neighbor.user_id;


  useFocusEffect(
    React.useCallback(() => {
      loadNeighborResources();
    }, [])
  );

  async function loadNeighborResources() {
    try {
      const q = query(
        collection(db, 'resources'),
        where('user_id', '==', neighbor.user_id)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Resource[];
      setResources(data);
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleSendSMS() {
    // Check if phone number exists
    if (!neighbor.phone_number) {
      Alert.alert(
        'Telefonnummer saknas',
        `${neighbor.name.split(' ')[0]} har inte delat sitt telefonnummer än.`,
        [{ text: 'OK' }]
      );
      return;
    }

    // Open SMS app with pre-filled number
    const smsUrl = `sms:${neighbor.phone_number}`;
    
    Linking.canOpenURL(smsUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(smsUrl);
        } else {
          Alert.alert('Fel', 'Kunde inte öppna SMS-appen');
        }
      })
      .catch((err) => {
        console.error('SMS error:', err);
        Alert.alert('Fel', 'Kunde inte öppna SMS-appen');
      });
  }

  const offers = resources.filter(r => r.type === 'offer' && !isExpired(r.expires_at));
  const needs = resources.filter(r => r.type === 'need' && !isExpired(r.expires_at));

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
    >
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.name}>{neighbor.name}</Text>
          <Text style={styles.info}>🔥 {neighbor.hearts_balance} Hearts</Text>
          <Text style={styles.info}>
            📍 {neighbor.availability_status === 'available' ? 'Tillgänglig' : 'Borta'}
          </Text>
        </Card.Content>
      </Card>

      {loading ? (
        <>
          <Text style={styles.sectionTitle}>Laddar resurser...</Text>
          {[1, 2].map(i => (
            <SkeletonCard key={i} />
          ))}
        </>
      ) : (
        <>
          {offers.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>ERBJUDER</Text>
                {offers.map(resource => (
                  <Card key={resource.id} style={styles.resourceCard}>
                    <Card.Content>
                      <StatusBadge status={resource.status} />
                      <UrgencyBadge expiresAt={resource.expires_at} showTimeRemaining />
                      <Text style={styles.resourceTitle}>{resource.title}</Text>
                      <Text style={styles.categoryLabel}>{getCategoryLabel(resource.category)}</Text>
                      <Text style={styles.resourceDesc}>{resource.description}</Text>
                    </Card.Content>
                  </Card>
                ))}
            </>
          )}

          {needs.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>BEHÖVER</Text>
                {needs.map(resource => (
                  <Card key={resource.id} style={styles.resourceCard}>
                    <Card.Content>
                      <StatusBadge status={resource.status} />
                      <UrgencyBadge expiresAt={resource.expires_at} showTimeRemaining />
                      <Text style={styles.resourceTitle}>{resource.title}</Text>
                      <Text style={styles.resourceDesc}>{resource.description}</Text>
                    </Card.Content>
                  </Card>
                ))}
            </>
          )}

          {resources.length === 0 && (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <Text style={styles.emptyIcon}>📦</Text>
                <Text style={styles.emptyTitle}>Inga resurser Ã¤n</Text>
                <Text style={styles.emptyText}>
                  {neighbor.name.split(' ')[0]} har inte lagt till några resurser ännu.
                </Text>
                {!isMe && (
                  <Text style={styles.emptyHint}>
                    💡 Du kan ändå skicka Hearts för hjälp du fått tidigare!
                  </Text>
                )}
              </Card.Content>
            </Card>
          )}
        </>
      )}

      <View style={styles.actions}>
        {!isMe && (
          <Button 
            mode="contained" 
            style={styles.button}
            buttonColor="#FF6B35"
            onPress={() => handleSendSMS()}
            icon="message-text"
          >
            Skicka SMS
          </Button>
        )}
        {!isMe && (
          <Button 
            mode="contained" 
            style={styles.button}
            buttonColor="#2D5016"
            onPress={() => navigation.navigate('SendHearts', { neighbor })}
            icon="heart"
          >
            Skicka Hearts
          </Button>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3F0',
    padding: 16
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#fff'
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2D5016'
  },
  info: {
    fontSize: 16,
    marginBottom: 4,
    color: '#666'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#2D5016'
  },
  resourceCard: {
    marginBottom: 12,
    backgroundColor: '#fff'
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4
  },
  resourceDesc: {
    fontSize: 14,
    color: '#666'
  },
  categoryLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4
  },
  emptyCard: {
    marginTop: 32,
    backgroundColor: '#FFF4E6'
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 24
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
    marginBottom: 8
  },
  emptyHint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic'
  },
  actions: {
    marginTop: 24,
    marginBottom: 32
  },
  button: {
    marginBottom: 12
  }
});
