import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Card, Button, Divider } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { useSnackbar } from '../hooks/useSnackbar';
import { User } from '../types';
import { getBlockedUsers, unblockUser } from '../lib/blockHelpers';
import { getDisplayName } from '../lib/displayHelpers';

export default function BlockedUsersScreen() {
  const insets = useSafeAreaInsets();
  const [blockedUsers, setBlockedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { showSnackbar } = useSnackbar();

  useFocusEffect(
    React.useCallback(() => {
      loadBlockedUsers();
    }, [])
  );

  async function loadBlockedUsers() {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      // Get blocked user IDs
      const blockedIds = await getBlockedUsers(currentUser.uid);
      
      if (blockedIds.length === 0) {
        setBlockedUsers([]);
        setLoading(false);
        return;
      }

      // Get user data for blocked users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() })) as User[];
      
      const blocked = users.filter(u => blockedIds.includes(u.user_id));
      setBlockedUsers(blocked);
    } catch (error) {
      console.error('Error loading blocked users:', error);
      showSnackbar('⚠️ Kunde inte ladda blockerade. Försök igen.', 5000);
    } finally {
      setLoading(false);
    }
  }

  async function handleUnblock(user: User) {
    Alert.alert(
      'Avblockera användare',
      `Vill du avblockera ${getDisplayName(user)}?`,
      [
        { text: 'Avbryt', style: 'cancel' },
        {
          text: 'Avblockera',
          onPress: async () => {
            try {
              const currentUser = auth.currentUser;
              if (!currentUser) return;

              await unblockUser(currentUser.uid, user.user_id);
              await loadBlockedUsers();
              Alert.alert('Avblockerad', `${getDisplayName(user)} är nu avblockerad.`);
            } catch (error) {
              showSnackbar('⚠️ Kunde inte avblockera. Försök igen.', 5000);
            }
          }
        }
      ]
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Laddar...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F3F0' }}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        <Text style={styles.header}>Blockerade användare</Text>

        {blockedUsers.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>
                Du har inte blockerat några användare
              </Text>
            </Card.Content>
          </Card>
        ) : (
          blockedUsers.map(user => (
            <Card key={user.id} style={styles.userCard}>
              <Card.Content>
                <View style={styles.userRow}>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{getDisplayName(user)}</Text>
                    <Text style={styles.userStatus}>Blockerad</Text>
                  </View>
                  <Button
                    mode="outlined"
                    onPress={() => handleUnblock(user)}
                    compact
                  >
                    Avblockera
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
  userCard: {
    marginBottom: 12,
    backgroundColor: '#fff'
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  userInfo: {
    flex: 1
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 4
  },
  userStatus: {
    fontSize: 12,
    color: '#C1121F'
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
