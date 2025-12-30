import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Card, Button, ActivityIndicator } from 'react-native-paper';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { Resource } from '../types';

export default function RemoveResourceScreen({ navigation }: any) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyResources();
  }, []);

  async function loadMyResources() {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, 'resources'),
        where('user_id', '==', user.uid)
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

  async function handleDelete(resource: Resource) {
    Alert.alert(
      'Ta bort resurs',
      `Är du säker på att du vill ta bort "${resource.title}"?`,
      [
        { text: 'Avbryt', style: 'cancel' },
        {
          text: 'Ta bort',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'resources', resource.id));
              setResources(resources.filter(r => r.id !== resource.id));
            } catch (error) {
              console.error('Error deleting resource:', error);
              Alert.alert('Fel', 'Kunde inte ta bort resursen');
            }
          }
        }
      ]
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2D5016" />
      </View>
    );
  }

  if (resources.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Du har inga resurser att ta bort</Text>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          buttonColor="#2D5016"
          textColor="#fff"
        >
          Tillbaka
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Välj resurs att ta bort</Text>
      
      {resources.map(resource => (
        <Card key={resource.id} style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>{resource.title}</Text>
            <Text style={styles.category}>
              {resource.type === 'offer' ? '📤 Erbjuder' : '📥 Behöver'} · {resource.category}
            </Text>
            {resource.description && (
              <Text style={styles.description}>{resource.description}</Text>
            )}
          </Card.Content>
          <Card.Actions>
            <Button
              mode="contained"
              onPress={() => handleDelete(resource)}
              buttonColor="#C1121F"
              textColor="#fff"
            >
              Ta bort
            </Button>
          </Card.Actions>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3F0',
    padding: 16
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2D5016'
  },
  card: {
    marginBottom: 12,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#2D5016'
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4
  },
  description: {
    fontSize: 14,
    color: '#999'
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 16
  },
  backButton: {
    marginTop: 16
  }
});
