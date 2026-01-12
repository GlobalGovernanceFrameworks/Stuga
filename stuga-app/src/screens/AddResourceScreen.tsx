// src/screens/AddResourceScreen.tsx
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons, Card, Snackbar, Switch } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { getDocs, query, collection, where, addDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { useNetworkState } from '../hooks/useNetworkState';
import { useSnackbar } from '../hooks/useSnackbar';
import { queueResourceCreate } from '../lib/database';
import { scheduleLocalNotification } from '../lib/notificationHelpers';
import { calculateDistance } from '../lib/locationHelpers';
import { getExpiryOptions, calculateExpiryTimestamp, getUrgencyLevel, formatTimeRemaining } from '../lib/expiryHelpers';
import { getCategoryLabel } from '../lib/categoryHelpers';

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
  const { visible, message, duration, showSnackbar, hideSnackbar } = useSnackbar();
  const [type, setType] = useState<'offer' | 'need'>('offer');
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [hasExpiry, setHasExpiry] = useState(false);
  const [selectedHours, setSelectedHours] = useState(24); // Default 24 hours
  const [customDate, setCustomDate] = useState('');

  async function handleSave() {
    // Validation errors → Keep alert (blocking)
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
        updated_at: Date.now(),
        expires_at: hasExpiry && selectedHours > 0 
          ? calculateExpiryTimestamp(selectedHours)
          : null
      };
      
      if (isOffline) {
        queueResourceCreate(resource);
        showSnackbar(`📦 "${title}" köas (läggs till vid nästa sync)`, 5000);
      } else {
        const docRef = await addDoc(collection(db, 'resources'), resource);
        
        // Notify nearby neighbors if urgent
        await notifyNearbyNeighbors({ ...resource, id: docRef.id });
        
        showSnackbar('✓ Resurs tillagd!', 4000);
      }
      
      setTimeout(() => {
        navigation.goBack();
      }, 500);
      
    } catch (error) {
      console.error('Error saving resource:', error);
      alert('Kunde inte spara resurs');
    }
  }

  async function notifyNearbyNeighbors(resource: any) {
    try {
      // Only notify for urgent resources
      const urgency = getUrgencyLevel(resource.expires_at);
      if (urgency !== 'urgent') {
        console.log('ℹ️ Not urgent, skipping notifications');
        return;
      }

      // Get current user's location
      const user = auth.currentUser;
      if (!user) return;

      const userDoc = await getDocs(
        query(collection(db, 'users'), where('user_id', '==', user.uid))
      );
      
      if (userDoc.empty) return;
      const userData = userDoc.docs[0].data();
      if (!userData.location) return;

      // Get all users within 500m
      const allUsers = await getDocs(collection(db, 'users'));
      const nearbyUsers = allUsers.docs.filter(doc => {
        const neighbor = doc.data();
        if (neighbor.user_id === user.uid) return false; // Skip self
        if (!neighbor.location) return false;
        if (!neighbor.fcm_token) return false; // Skip users without notifications

        const distance = calculateDistance(
          userData.location.lat,
          userData.location.lon,
          neighbor.location.lat,
          neighbor.location.lon
        );

        return distance <= 500; // Within 500m
      });

      console.log(`📢 Notifying ${nearbyUsers.length} nearby neighbors`);

      // For MVP: Send local notification (in production, use Cloud Functions)
      if (nearbyUsers.length > 0) {
        const categoryLabel = getCategoryLabel(resource.category);
        const timeRemaining = formatTimeRemaining(resource.expires_at);
        
        await scheduleLocalNotification(
          `🔴 ${categoryLabel} ${resource.type === 'need' ? 'behövs' : 'erbjuds'}`,
          `${resource.title} • ${timeRemaining}`,
          { 
            type: 'urgent_resource',
            resourceId: resource.id
          }
        );
      }
    } catch (error) {
      console.error('Error notifying neighbors:', error);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F3F0' }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
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

              {/* Expiry section */}
              <View style={styles.expirySection}>
                <View style={styles.expiryHeader}>
                  <Text style={styles.label}>Utgångsdatum</Text>
                  <Switch
                    value={hasExpiry}
                    onValueChange={setHasExpiry}
                    color="#2D5016"
                  />
                </View>
                
                {hasExpiry && (
                  <View style={styles.expiryOptions}>
                    <Text style={styles.expiryHint}>
                      ⏱️ När är resursen inte längre tillgänglig?
                    </Text>
                    <View style={styles.quickButtons}>
                      {[
                        { label: '6 tim', hours: 6 },
                        { label: '24 tim', hours: 24 },
                        { label: '3 dagar', hours: 72 },
                        { label: '1 vecka', hours: 168 }
                      ].map(option => (
                        <Button
                          key={option.hours}
                          mode={selectedHours === option.hours ? 'contained' : 'outlined'}
                          onPress={() => setSelectedHours(option.hours)}
                          style={styles.quickButton}
                          buttonColor={selectedHours === option.hours ? '#2D5016' : undefined}
                          compact
                        >
                          {option.label}
                        </Button>
                      ))}
                    </View>
                    <Text style={styles.expiryPreview}>
                      Utgår: {new Date(calculateExpiryTimestamp(selectedHours)).toLocaleString('sv-SE', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </View>
                )}
              </View>
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
        <Snackbar
          visible={visible}
          onDismiss={hideSnackbar}
          duration={duration}
          action={{
            label: 'OK',
            onPress: hideSnackbar,
          }}
          style={{ backgroundColor: '#2D5016' }}
        >
          {message}
        </Snackbar>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
  expirySection: {
    marginTop: 8
  },
  expiryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  expiryOptions: {
    marginTop: 8
  },
  expiryHint: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12
  },
  quickButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12
  },
  quickButton: {
    flex: 1,
    minWidth: '20%'
  },
  expiryPreview: {
    fontSize: 14,
    color: '#2D5016',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 8,
    backgroundColor: '#E8F5E9',
    borderRadius: 8
  },
  saveButton: {
    marginVertical: 16
  }
});
