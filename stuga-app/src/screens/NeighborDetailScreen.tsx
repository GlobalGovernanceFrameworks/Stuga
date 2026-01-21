import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Linking, Alert, View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Card, Button, ActivityIndicator } from 'react-native-paper';
import { collection, query, where, getDocs, or } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { Resource } from '../types';
import { blockUser, isUserBlocked } from '../lib/blockHelpers';
import { getCategoryLabel } from '../lib/categoryHelpers';
import { acceptContactRequest, declineContactRequest, getContactStatus, sendContactRequest } from '../lib/contactHelpers';
import { getDisplayName, getRealName } from '../lib/displayHelpers';
import { getCurrentLocation, calculateDistance, formatDistance, formatDistanceFuzzy } from '../lib/locationHelpers';
import { SkeletonCard } from '../components/SkeletonCard';
import { StatusBadge } from '../components/StatusBadge';
import { UrgencyBadge } from '../components/UrgencyBadge';
import { useSnackbar } from '../hooks/useSnackbar';
import { isExpired } from '../lib/expiryHelpers';

export default function NeighborDetailScreen({ route, navigation }: any) {
  const { neighbor } = route.params;
  const [resources, setResources] = useState<Resource[]>([]);
  const [contactStatus, setContactStatus] = useState<'none' | 'pending_sent' | 'pending_received' | 'accepted' | 'declined'>('none');
  const [pendingRequestId, setPendingRequestId] = useState<string | null>(null);
  const [contactAcceptedDate, setContactAcceptedDate] = useState<number | null>(null);
  const [checkingContact, setCheckingContact] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [distance, setDistance] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const { showSnackbar } = useSnackbar();
  const insets = useSafeAreaInsets();
  const currentUser = auth.currentUser;
  const isMe = currentUser?.uid === neighbor.user_id;

  useFocusEffect(
    React.useCallback(() => {
      loadNeighborResources();
      checkContactStatus();
      loadDistance();
      checkBlockStatus();
    }, [])
  );

  async function checkBlockStatus() {
    if (isMe) return;
    
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const blocked = await isUserBlocked(currentUser.uid, neighbor.user_id);
      setIsBlocked(blocked);
    } catch (error) {
      console.error('Error checking block status:', error);
    }
  }

  async function handleBlockUser() {
    Alert.alert(
      'Blockera användare',
      `Är du säker på att du vill blockera ${getDisplayName(neighbor)}?`,
      [
        { text: 'Avbryt', style: 'cancel' },
        {
          text: 'Blockera',
          style: 'destructive',
          onPress: async () => {
            try {
              const currentUser = auth.currentUser;
              if (!currentUser) return;

              console.log('🚫 About to block:', {
                neighborDocId: neighbor.id,
                neighborUserId: neighbor.user_id,
                willBlock: neighbor.user_id // ← VILKEN ANVÄNDER VI?
              });

              await blockUser(currentUser.uid, neighbor.user_id);
              setIsBlocked(true);
              
              Alert.alert(
                'Blockerad',
                `${getDisplayName(neighbor)} är nu blockerad.`,
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack()
                  }
                ]
              );
            } catch (error) {
              Alert.alert('Fel', 'Kunde inte blockera användare');
            }
          }
        }
      ]
    );
  }

  async function handleUnblockUser() {
    Alert.alert(
      'Avblockera användare',
      `Vill du avblockera ${getDisplayName(neighbor)}?`,
      [
        { text: 'Avbryt', style: 'cancel' },
        {
          text: 'Avblockera',
          onPress: async () => {
            try {
              const currentUser = auth.currentUser;
              if (!currentUser) return;

              await unblockUser(currentUser.uid, neighbor.user_id);
              setIsBlocked(false);
              
              Alert.alert('Avblockerad', `${getDisplayName(neighbor)} är nu avblockerad.`);
            } catch (error) {
              Alert.alert('Fel', 'Kunde inte avblockera användare');
            }
          }
        }
      ]
    );
  }

  async function checkContactStatus() {
    if (isMe) {
      setCheckingContact(false);
      return;
    }
    
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      // Check for any existing contact request
      const q = query(
        collection(db, 'contact_requests'),
        or(
          where('from_user', '==', currentUser.uid),
          where('to_user', '==', currentUser.uid)
        )
      );

      const snapshot = await getDocs(q);
      
      // Find request involving both users
      const requestDoc = snapshot.docs.find(doc => {
        const data = doc.data();
        return (
          (data.from_user === currentUser.uid && data.to_user === neighbor.user_id) ||
          (data.from_user === neighbor.user_id && data.to_user === currentUser.uid)
        );
      });

      if (!requestDoc) {
        setContactStatus('none');
        setPendingRequestId(null);
        setCheckingContact(false);
        return;
      }

      const data = requestDoc.data();
      const requestId = requestDoc.id;
      
      // Save request ID
      setPendingRequestId(requestId);
      
      if (data.status === 'accepted') {
        setContactStatus('accepted');
        setContactAcceptedDate(data.responded_at || data.created_at);
      } else if (data.status === 'declined') {
        setContactStatus('declined');
      } else if (data.from_user === currentUser.uid) {
        setContactStatus('pending_sent');
      } else {
        setContactStatus('pending_received');
      }
      
    } catch (error) {
      console.error('Error checking contact status:', error);
      showSnackbar('⚠️ Kunde inte ladda kontaktstatus.', 4000);
    } finally {
      setCheckingContact(false);
    }
  }

  function formatContactDate(timestamp: number | null): string {
    if (!timestamp) return 'nyligen';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'idag';
    if (diffDays === 1) return 'igår';
    if (diffDays < 7) return `${diffDays} dagar sedan`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return weeks === 1 ? '1 vecka sedan' : `${weeks} veckor sedan`;
    }
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return months === 1 ? '1 månad sedan' : `${months} månader sedan`;
    }
    
    return date.toLocaleDateString('sv-SE', { 
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    });
  }

  async function loadDistance() {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !neighbor.location) return;

      // Get current user's location
      const userDoc = await getDocs(
        query(collection(db, 'users'), where('user_id', '==', currentUser.uid))
      );
      
      if (userDoc.empty) return;
      const userData = userDoc.docs[0].data();
      if (!userData.location) return;

      setUserLocation(userData.location);

      const dist = calculateDistance(
        userData.location.lat,
        userData.location.lon,
        neighbor.location.lat,
        neighbor.location.lon
      );
      
      setDistance(dist);
    } catch (error) {
      console.error('Error loading distance:', error);
      // Silent fail - distance är nice-to-have
    }
  }

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
      showSnackbar('⚠️ Kunde inte ladda resurser. Försök igen.', 5000);
      setResources([]);  // Clear stale data
    } finally {
      setLoading(false);
    }
  }

  async function handleRequestContact() {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      Alert.alert(
        'Begär kontakt',
        `Vill du begära kontakt med ${getDisplayName(neighbor)}? De kommer se din profil och kan välja att acceptera eller avböja.`,
        [
          { text: 'Avbryt', style: 'cancel' },
          {
            text: 'Skicka förfrågan',
            onPress: async () => {
              try {
                await sendContactRequest(currentUser.uid, neighbor.user_id);
                setContactStatus('pending_sent');
                Alert.alert('Skickat!', 'Din kontaktförfrågan har skickats.');
              } catch (error) {
                Alert.alert('Fel', 'Kunde inte skicka kontaktförfrågan.');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error requesting contact:', error);
    }
  }

  async function handleAcceptContact() {
    if (!pendingRequestId) {
      Alert.alert('Fel', 'Ingen förfrågan hittades');
      return;
    }

    Alert.alert(
      'Acceptera kontakt',
      `Vill du acceptera kontakt med ${getDisplayName(neighbor)}? De kommer kunna se ditt riktiga namn och telefonnummer.`,
      [
        { text: 'Avbryt', style: 'cancel' },
        {
          text: 'Acceptera',
          onPress: async () => {
            try {
              await acceptContactRequest(pendingRequestId);
              setContactStatus('accepted');
              Alert.alert(
                'Kontakt accepterad!',
                `Du och ${getDisplayName(neighbor)} kan nu kontakta varandra.`
              );
            } catch (error) {
              console.error('Error accepting contact:', error);
              Alert.alert('Fel', 'Kunde inte acceptera kontakt');
            }
          }
        }
      ]
    );
  }

  async function handleDeclineContact() {
    if (!pendingRequestId) {
      Alert.alert('Fel', 'Ingen förfrågan hittades');
      return;
    }

    Alert.alert(
      'Avböj kontakt',
      `Vill du avböja kontaktförfrågan från ${getDisplayName(neighbor)}?`,
      [
        { text: 'Avbryt', style: 'cancel' },
        {
          text: 'Avböj',
          style: 'destructive',
          onPress: async () => {
            try {
              await declineContactRequest(pendingRequestId);
              setContactStatus('declined');
              Alert.alert('Avböjd', 'Kontaktförfrågan har avböjts.');
              // Optionally navigate back
              navigation.goBack();
            } catch (error) {
              console.error('Error declining contact:', error);
              Alert.alert('Fel', 'Kunde inte avböja kontakt');
            }
          }
        }
      ]
    );
  }

  function handleSendSMS() {
    // Existing SMS function - only callable when contact accepted
    if (!neighbor?.phone_number) {
      Alert.alert(
        'Telefonnummer saknas',
        `${getRealName(neighbor)} har inte delat sitt telefonnummer än.`,
        [{ text: 'OK' }]
      );
      return;
    }

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

  function renderContactButton() {
    if (checkingContact) {
      return (
        <Button 
          mode="outlined" 
          style={styles.button}
          disabled
        >
          Kontrollerar...
        </Button>
      );
    }

    switch (contactStatus) {
      case 'none':
        return (
          <Button 
            mode="contained" 
            style={styles.button}
            buttonColor="#FF6B35"
            onPress={handleRequestContact}
            icon="account-plus"
          >
            Begär kontakt
          </Button>
        );
      
      case 'pending_sent':
        return (
          <Button 
            mode="outlined" 
            style={styles.button}
            disabled
            icon="clock-outline"
          >
            Väntar på svar...
          </Button>
        );
      
      case 'pending_received':
        return (
          <View style={styles.pendingActions}>
            <Button 
              mode="contained" 
              style={[styles.button, { flex: 1 }]}
              buttonColor="#6BCF7F"
              onPress={handleAcceptContact}
              icon="check"
            >
              Acceptera
            </Button>
            <Button 
              mode="outlined" 
              style={[styles.button, { flex: 1 }]}
              onPress={handleDeclineContact}
              icon="close"
            >
              Avböj
            </Button>
          </View>
        );
      
      case 'accepted':
        return (
          <Button 
            mode="contained" 
            style={styles.button}
            buttonColor="#FF6B35"
            onPress={handleSendSMS}
            icon="message-text"
          >
            Skicka SMS
          </Button>
        );
      
      case 'declined':
        return (
          <Button 
            mode="outlined" 
            style={styles.button}
            disabled
          >
            Kontakt avböjd
          </Button>
        );
      
      default:
        return null;
    }
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
    >
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.name}>
            {neighbor.is_block_captain && '🛡️ '}
            {contactStatus === 'accepted' ? getRealName(neighbor) : getDisplayName(neighbor)}
          </Text>

          {distance !== null && (
            <Text style={styles.info}>
              📍 {contactStatus === 'accepted' && neighbor.privacy_settings?.exact_distance
                ? formatDistance(distance)
                : formatDistanceFuzzy(distance)
              }
            </Text>
          )}

          <Text style={styles.info}>🔥 {neighbor?.hearts_balance ?? 0} Hearts</Text>
          {contactStatus === 'accepted' && (
            <Text style={styles.contactInfo}>
              ✓ Ni har kontakt sedan {formatContactDate(contactAcceptedDate)}
            </Text>
          )}
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
                  {getDisplayName(neighbor).split(' ')[0]} har inte lagt till några resurser ännu.
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
        {isBlocked ? (
          <Button 
            mode="outlined" 
            style={styles.button}
            onPress={handleUnblockUser}
            icon="account-remove"
            textColor="#666"
          >
            Avblockera
          </Button>
        ) : (
          <>
            {!isMe && renderContactButton()}
            {!isMe && contactStatus === 'accepted' && (
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
            {!isMe && (
              <Button 
                mode="text" 
                style={styles.button}
                onPress={handleBlockUser}
                icon="block-helper"
                textColor="#C1121F"
              >
                Blockera
              </Button>
            )}
          </>
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
  },
  pendingActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%'
  },
  contactInfo: {
    fontSize: 12,
    color: '#6BCF7F',
    marginTop: 8,
    fontStyle: 'italic'
  }
});
