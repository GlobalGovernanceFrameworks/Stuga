import React, { useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { initDatabase } from './src/lib/database';

export default function App() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <PaperProvider>
      <AppNavigator />
    </PaperProvider>
  );
}
