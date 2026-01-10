import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { NavigationContainerRef } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import RegistrationScreen from './src/screens/RegistrationScreen';
import { initDatabase } from './src/lib/database';
import { signInAnonymously } from 'firebase/auth';
import { auth, db } from './src/config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function App() {
  const navigationRef = useRef<NavigationContainerRef<any>>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    initDatabase();
    checkRegistrationStatus();

    // Handle notification taps when app is backgrounded/closed
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      
      if (data.type === 'urgent_resource' && navigationRef.current) {
        navigationRef.current.navigate('Resources');
      }
    });

    return () => subscription.remove();
  }, []);

  async function checkRegistrationStatus() {
    try {
      // Sign in anonymously
      const userCredential = await signInAnonymously(auth);
      const userId = userCredential.user.uid;
      
      console.log('🔐 Signed in:', userId);

      // Check if user document exists and has registration_completed
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists() && userDoc.data().registration_completed) {
        console.log('✅ User already registered');
        setIsRegistered(true);
      } else {
        console.log('ℹ️ New user, showing registration');
        setIsRegistered(false);
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleRegistrationComplete() {
    setIsRegistered(true);
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2D5016" />
      </View>
    );
  }

  return (
    <PaperProvider>
      {isRegistered ? (
        <AppNavigator navigationRef={navigationRef} />
      ) : (
        <RegistrationScreen onRegistrationComplete={handleRegistrationComplete} />
      )}
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F3F0'
  }
});
