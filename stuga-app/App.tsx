import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { NavigationContainerRef } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import RegistrationScreen from './src/screens/RegistrationScreen';
import LoginScreen from './src/screens/LoginScreen';
import { initDatabase } from './src/lib/database';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './src/config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function App() {
  const navigationRef = useRef<NavigationContainerRef<any>>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    // TEMPORARY: Force logout to test new login flow
    initDatabase();

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('Auth state changed:', currentUser?.uid || 'not logged in');
      
      if (currentUser) {
        // User is logged in - check if profile is complete
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        
        if (userDoc.exists() && userDoc.data().registration_completed) {
          console.log('User profile complete');
          setIsRegistered(true);
        } else {
          console.log('User needs to complete registration');
          setIsRegistered(false);
        }
        setUser(currentUser);
      } else {
        // No user logged in
        console.log('No user logged in');
        setUser(null);
        setIsRegistered(false);
      }
      
      setLoading(false);
    });

    // Handle notification taps when app is backgrounded/closed
    const notificationSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      
      if (data.type === 'urgent_resource' && navigationRef.current) {
        navigationRef.current.navigate('Resources');
      }
    });

    return () => {
      unsubscribe();
      notificationSubscription.remove();
    };
  }, []);

  function handleLoginComplete() {
    // Auth state listener will handle the rest
    console.log('Login complete, checking profile...');
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
      {!user ? (
        <LoginScreen onLoginComplete={handleLoginComplete} />
      ) : !isRegistered ? (
        <RegistrationScreen onRegistrationComplete={handleRegistrationComplete} />
      ) : (
        <AppNavigator navigationRef={navigationRef} />
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
