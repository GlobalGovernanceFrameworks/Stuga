// src/screens/ContactRequestsScreen.tsx
import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, Divider } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { ContactRequest, User } from '../types';
import { acceptContactRequest, declineContactRequest } from '../lib/contactHelpers';
import { getDisplayName } from '../lib/displayHelpers';

export default function ContactRequestsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [requests, setRequests] = useState<(ContactRequest & { fromUser?: User })[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadRequests();
    }, [])
  );

  async function loadRequests() {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      // Get pending requests
      const q = query(
        collection(db, 'contact_requests'),
        where('to_user', '==', currentUser.uid),
        where('status', '==', 'pending')
      );

      const snapshot = await getDocs(q);
      const requestsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ContactRequest[];

      // Get user info for each request
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];

      const enrichedRequests = requestsData.map(request => ({
        ...request,
        fromUser: users.find(u => u.user_id === request.from_user)
      }));

      setRequests(enrichedRequests);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAccept(request: ContactRequest) {
    try {
      await acceptContactRequest(request.id);
      await loadRequests(); // Refresh
      // TODO: Show snackbar
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  }

  async function handleDecline(request: ContactRequest) {
    try {
      await declineContactRequest(request.id);
      await loadRequests(); // Refresh
    } catch (error) {
      console.error('Error declining request:', error);
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Laddar förfrågningar...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F3F0' }}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        <Text style={styles.header}>Kontaktförfrågningar</Text>

        {requests.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>Inga väntande förfrågningar</Text>
            </Card.Content>
          </Card>
        ) : (
          requests.map(request => (
            <Card key={request.id} style={styles.requestCard}>
              <Card.Content>
                <Text style={styles.fromName}>
                  {request.fromUser ? getDisplayName(request.fromUser) : 'Okänd användare'}
                </Text>
                <Text style={styles.requestText}>vill ha kontakt med dig</Text>
                {request.message && (
                  <Text style={styles.message}>"{request.message}"</Text>
                )}
                <Text style={styles.date}>
                  {new Date(request.created_at).toLocaleDateString('sv-SE')}
                </Text>
                
                <Divider style={styles.divider} />
                
                <View style={styles.actions}>
                  <Button
                    mode="contained"
                    onPress={() => handleAccept(request)}
                    style={styles.acceptButton}
                    buttonColor="#6BCF7F"
                    icon="check"
                  >
                    Acceptera
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => handleDecline(request)}
                    style={styles.declineButton}
                    icon="close"
                  >
                    Avböj
                  </Button>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2D5016'
  },
  requestCard: {
    marginBottom: 12,
    backgroundColor: '#fff'
  },
  fromName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 4
  },
  requestText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8
  },
  message: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
    marginBottom: 8,
    paddingLeft: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#2D5016'
  },
  date: {
    fontSize: 12,
    color: '#999'
  },
  divider: {
    marginVertical: 12
  },
  actions: {
    flexDirection: 'row',
    gap: 12
  },
  acceptButton: {
    flex: 1
  },
  declineButton: {
    flex: 1
  },
  emptyCard: {
    backgroundColor: '#FFF4E6',
    marginTop: 32
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16
  }
});
