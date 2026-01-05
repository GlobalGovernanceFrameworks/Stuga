import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons, Card } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { useNetworkState } from '../hooks/useNetworkState';
import { queueResourceCreate } from '../lib/database';

const CATEGORIES = [
  { value: 'mat', label: 'Mat 🥪', icon: 'food' },
  { value: 'värme', label: 'Värme 🔥', icon: 'fire' },
  { value: 'verktyg', label: 'Verktyg 🔨', icon: 'hammer' },
  { value: 'transport', label: 'Transport 🚗', icon: 'car' },
  { value: 'kunskap', label: 'Kunskap 📚', icon: 'book' },
  { value: 'boende', label: 'Boende 🏠', icon: 'home' },
  { value: 'första_hjälpen', label: 'Första hjälpen ⚕️', icon: 'medical-bag' },
  { value: 'annat', label: 'Annat', icon: 'dots-horizontal' }
];

export default function AddResourceScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { isOffline } = useNetworkState();
  const [type, setType] = useState<'offer' | 'need'>('offer');
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!category) {
      alert('Välj en kategori');
      return;
    }
    if (!title.trim()) {
      alert('Ange en titel');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      const resource = {
        user_id: user.uid,
        type,
        category,
        title: title.trim(),
        description: description.trim(),
        status: 'open',
        matched_with_user: null,
        hearts_value: null,
        created_at: Date.now(),
        updated_at: Date.now()
      };

      if (isOffline) {
        // Queue for later when offline
        queueResourceCreate(resource);
        alert(`📦 Offline: Resursen köad!\n\n"${title}" kommer läggas till när du är online igen.`);
      } else {
        // Save immediately when online
        await addDoc(collection(db, 'resources'), resource);
        alert('✅ Resurs tillagd!');
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error saving resource:', error);
      alert('Kunde inte spara resurs');
    }
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
    >
      {isOffline && (
        <Card style={styles.offlineCard}>
          <Card.Content>
            <Text style={styles.offlineText}>
              📡 Offline-läge: Resursen kommer köas och läggas till när du är online
            </Text>
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.label}>Jag...</Text>
          <SegmentedButtons
            value={type}
            onValueChange={(value) => setType(value as 'offer' | 'need')}
            buttons={[
              { value: 'offer', label: 'Erbjuder' },
              { value: 'need', label: 'Behöver' }
            ]}
            style={styles.segmented}
          />

          <Text style={styles.label}>Kategori</Text>
          <View style={styles.categories}>
            {CATEGORIES.map(cat => (
              <Button
                key={cat.value}
                mode={category === cat.value ? 'contained' : 'outlined'}
                onPress={() => setCategory(cat.value)}
                style={styles.categoryButton}
                buttonColor={category === cat.value ? '#2D5016' : undefined}
              >
                {cat.label}
              </Button>
            ))}
          </View>

          <Text style={styles.label}>Titel</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="T.ex. Generator, 5kW"
            mode="outlined"
            style={styles.input}
            maxLength={100}
          />

          <Text style={styles.label}>Beskrivning</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Detaljer om resursen..."
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
            maxLength={500}
          />
          <Text style={styles.charCount}>{description.length}/500</Text>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleSave}
        loading={saving}
        disabled={saving || !category || !title.trim()}
        style={styles.saveButton}
        buttonColor="#2D5016"
      >
        Spara resurs
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  offlineCard: {
    marginBottom: 16,
    backgroundColor: '#FFF4E6'
  },
  offlineText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F3F0',
    padding: 16
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#fff'
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#2D5016'
  },
  segmented: {
    marginBottom: 8
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8
  },
  categoryButton: {
    marginBottom: 8
  },
  input: {
    backgroundColor: '#fff'
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#999',
    marginTop: 4
  },
  saveButton: {
    marginVertical: 16
  }
});
