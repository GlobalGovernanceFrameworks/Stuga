import { Linking, Platform, Alert } from 'react-native';

/**
 * Opens the device's app settings page
 * iOS: Opens Settings > [App Name]
 * Android: Opens App Info page
 */
export async function openAppSettings(): Promise<void> {
  try {
    if (Platform.OS === 'ios') {
      await Linking.openURL('app-settings:');
    } else {
      await Linking.openSettings();
    }
  } catch (error) {
    console.error('Could not open settings:', error);
    Alert.alert(
      'Kunde inte öppna inställningar',
      'Öppna Inställningar manuellt och leta upp Stuga i listan.'
    );
  }
}

/**
 * Check if app can open settings
 * Useful for enabling/disabling settings button
 */
export async function canOpenSettings(): Promise<boolean> {
  try {
    const url = Platform.OS === 'ios' ? 'app-settings:' : 'settings:';
    return await Linking.canOpenURL(url);
  } catch {
    return false;
  }
}
