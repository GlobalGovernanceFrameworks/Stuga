import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Text, TextInput, Button, Card } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function LoginScreen({ onLoginComplete }: { onLoginComplete: () => void }) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isNewAccount, setIsNewAccount] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Fält saknas', 'Ange både e-post och lösenord.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Ogiltigt format', 'Ange en giltig e-postadress.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('För kort lösenord', 'Lösenordet måste vara minst 6 tecken.');
      return;
    }

    setLoading(true);
    try {
      if (isNewAccount) {
        // Create new account
        await createUserWithEmailAndPassword(auth, email, password);
        console.log('✅ New account created');
      } else {
        // Login to existing account
        await signInWithEmailAndPassword(auth, email, password);
        console.log('✅ Logged in');
      }
      
      // App.tsx will handle checking if profile is complete
      onLoginComplete();
    } catch (error: any) {
      console.error('Auth error:', error);
      
      // User-friendly error messages
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('E-posten används redan', 'Kontot finns redan. Försök logga in istället.');
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        Alert.alert('Felaktiga uppgifter', 'E-post eller lösenord är fel. Försök igen.');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Ogiltig e-post', 'Ange en giltig e-postadress.');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Svagt lösenord', 'Lösenordet måste vara minst 6 tecken.');
      } else {
        Alert.alert('Fel', 'Kunde inte logga in. Försök igen.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      Alert.alert('Ange e-post', 'Fyll i din e-postadress först.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Ogiltigt format', 'Ange en giltig e-postadress först.');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        'E-post skickad',
        'Kontrollera din inkorg för instruktioner om att återställa lösenordet.'
      );
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      if (error.code === 'auth/user-not-found') {
        Alert.alert('Användare saknas', 'Ingen användare med den e-postadressen.');
      } else {
        Alert.alert('Fel', 'Kunde inte skicka återställnings-e-post. Försök igen.');
      }
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
              Grannhjälp och resursbyte i Upplands Väsby
            </Text>
          </View>

          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>
                {isNewAccount ? 'Skapa konto' : 'Logga in'}
              </Text>
              
              <Text style={styles.label}>E-postadress</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="din@email.se"
                mode="outlined"
                style={styles.input}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
              />

              <Text style={styles.label}>Lösenord</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Minst 6 tecken"
                mode="outlined"
                style={styles.input}
                secureTextEntry
                autoComplete={isNewAccount ? "password-new" : "password"}
              />

              {!isNewAccount && (
                <Button
                  mode="text"
                  onPress={handleForgotPassword}
                  disabled={loading}
                  style={styles.forgotButton}
                  compact
                >
                  Glömt lösenord?
                </Button>
              )}

              <Button
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                disabled={loading || !email.trim() || !password.trim()}
                style={styles.loginButton}
                buttonColor="#2D5016"
                contentStyle={styles.buttonContent}
              >
                {isNewAccount ? 'Skapa konto' : 'Logga in'}
              </Button>

              <Button
                mode="text"
                onPress={() => setIsNewAccount(!isNewAccount)}
                disabled={loading}
                style={styles.toggleButton}
              >
                {isNewAccount 
                  ? 'Har du redan ett konto? Logga in' 
                  : 'Inget konto? Skapa ett'}
              </Button>
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
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: 8
  },
  loginButton: {
    marginTop: 24,
    marginBottom: 8
  },
  buttonContent: {
    paddingVertical: 8
  },
  toggleButton: {
    marginTop: 8
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
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic'
  }
});
