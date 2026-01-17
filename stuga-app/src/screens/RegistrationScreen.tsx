import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Text, TextInput, Button, Card, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { requestLocationPermission, getCurrentLocation, roundLocationForPrivacy, calculateDistance } from '../lib/locationHelpers';

// Upplands Väsby kommun bounds (approximate)
const PILOT_AREA = {
  name: 'Upplands Väsby kommun',
  center: { lat: 59.5186, lon: 17.9448 },
  radiusMeters: 10000 // 10km radius covers most of kommun
};

export default function RegistrationScreen({ onRegistrationComplete }: { onRegistrationComplete: () => void }) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    // Validation
    if (!name.trim()) {
      Alert.alert('Namn krävs', 'Ange ditt namn för att fortsätta.');
      return;
    }

    if (!phoneNumber.trim()) {
      Alert.alert('Telefonnummer krävs', 'Ange ditt telefonnummer för SMS-kontakt.');
      return;
    }

    // Basic phone validation (Swedish format)
    const phoneRegex = /^(\+46|0)[0-9]{9,10}$/;
    const cleanedPhone = phoneNumber.replace(/[\s-]/g, ''); // Remove both spaces AND dashes
    if (!phoneRegex.test(cleanedPhone)) {
      Alert.alert(
        'Ogiltigt telefonnummer',
        'Ange ett svenskt telefonnummer (format: 070-123 45 67 eller +46701234567)'
      );
      return;
    }

    setLoading(true);

    try {
      // Request location permission
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert(
          'Platsbehörighet krävs',
          'Stuga behöver din plats för att hitta grannar i närheten. Aktivera platsåtkomst i inställningarna.'
        );
        setLoading(false);
        return;
      }

      // Get current location
      const location = await getCurrentLocation();
      if (!location) {
        Alert.alert('Fel', 'Kunde inte hämta din plats. Försök igen.');
        setLoading(false);
        return;
      }

      // Check if in pilot area (Upplands VÃ¤sby)
      const distanceFromCenter = calculateDistance(
        location.lat,
        location.lon,
        PILOT_AREA.center.lat,
        PILOT_AREA.center.lon
      );

      if (distanceFromCenter > PILOT_AREA.radiusMeters) {
        Alert.alert(
          'Utanför pilotområde',
          `Stuga-piloten är för närvarande endast tillgänglig i ${PILOT_AREA.name}. Du är ${Math.round(distanceFromCenter / 1000)} km från området.\n\nVi planerar att expandera till fler områden snart!`,
          [{ text: 'OK' }]
        );
        setLoading(false);
        return;
      }

      // Round location for privacy
      const rounded = roundLocationForPrivacy(location.lat, location.lon);

      // Get current user
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Fel', 'Ingen användare inloggad. Försök starta om appen.');
        setLoading(false);
        return;
      }

      // Generate default display name if not provided
      const finalDisplayName = displayName.trim() || `Granne #${Math.floor(1000 + Math.random() * 9000)}`;

      // Save user to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        user_id: user.uid,
        name: name.trim(),
        display_name: finalDisplayName,
        phone_number: phoneNumber.replace(/[\s-]/g, ''),
        bankid_verified: false,
        created_at: Date.now(),
        location: {
          lat: rounded.lat,
          lon: rounded.lon,
          accuracy: Math.round(location.accuracy),
          updated_at: Date.now()
        },
        hearts_balance: 100,
        availability_status: 'available',
        registration_completed: true,
        privacy_settings: { 
          exact_distance: false,
          show_hearts: true
        },
        blocked_users: [],
        is_block_captain: false
      });

      console.log('✅ User registered successfully');
      
      // Call completion handler
      onRegistrationComplete();

    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Fel', 'Kunde inte registrera. Försök igen.');
    } finally {
      setLoading(false);
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
          contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Välkommen till Stuga</Text>
            <Text style={styles.subtitle}>
              Grannhjälp och resursbyte i {PILOT_AREA.name}
            </Text>
          </View>

          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Skapa ditt konto</Text>
              
              <Text style={styles.label}>Ditt namn</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Anna Svensson"
                mode="outlined"
                style={styles.input}
                autoCapitalize="words"
                autoComplete="name"
                maxLength={50}
              />
              <Text style={styles.hint}>
                📝 Ditt riktiga namn sparas privat och visas bara när du godkänner kontakt
              </Text>

              {/* Display name input */}
              <Text style={styles.label}>Visningsnamn (valfritt)</Text>
              <TextInput
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Granne i Väsby, Anna S, etc."
                mode="outlined"
                style={styles.input}
                autoCapitalize="words"
                maxLength={30}
              />
              <Text style={styles.hint}>
                👁️ Detta namn ser andra grannar innan ni har kontakt
              </Text>

              <Text style={styles.label}>Telefonnummer</Text>
              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="070-123 45 67"
                mode="outlined"
                style={styles.input}
                keyboardType="phone-pad"
                autoComplete="tel"
                maxLength={20}
              />
              
              <Text style={styles.hint}>
                📍 Din plats används för att hitta grannar inom 500m
              </Text>
              <Text style={styles.hint}>
                📱 Ditt nummer används för SMS-kontakt med grannar
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.infoCard}>
            <Card.Content>
              <Text style={styles.infoTitle}>Om Stuga</Text>
              <Text style={styles.infoText}>
                • Hitta grannar som kan hjälpa till{'\n'}
                • Dela resurser (mat, verktyg, kunskap){'\n'}
                • Tacka med Hearts-valuta{'\n'}
                • Brådskande behov prioriteras automatiskt
              </Text>
            </Card.Content>
          </Card>

          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            disabled={loading || !name.trim() || !phoneNumber.trim()}
            style={styles.registerButton}
            buttonColor="#2D5016"
            contentStyle={styles.buttonContent}
          >
            {loading ? 'Registrerar...' : 'Kom igång'}
          </Button>

          <Text style={styles.footerText}>
            Pilotprojekt i samarbete med Upplands Väsby kommun
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  header: {
    marginTop: 32,
    marginBottom: 24,
    alignItems: 'center'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center'
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#fff'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 16
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
    color: '#2D5016'
  },
  input: {
    backgroundColor: '#fff'
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    lineHeight: 18
  },
  infoCard: {
    marginBottom: 24,
    backgroundColor: '#E8F5E9'
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 8
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22
  },
  registerButton: {
    marginBottom: 16
  },
  buttonContent: {
    paddingVertical: 8
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic'
  }
});
