import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Request notification permissions
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('⚠️ Notification permission not granted');
      return false;
    }

    console.log('✅ Notification permission granted');
    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
}

// Get push notification token (for sending notifications)
export async function getPushToken(): Promise<string | null> {
  try {
    // Only works on physical devices
    if (!Constants.isDevice) {
      console.warn('⚠️ Push notifications only work on physical devices');
      return null;
    }

    const token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId || 'your-project-id'
    });

    console.log('📱 Push token:', token.data);
    return token.data;
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
}

// Schedule a local notification (for testing)
export async function scheduleLocalNotification(
  title: string,
  body: string,
  data?: any
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
    },
    trigger: null, // Show immediately
  });
}

// Send notification to specific user (requires backend/Cloud Function in production)
// For MVP, we'll use local notifications
export async function notifyNearbyNeighbors(
  resourceTitle: string,
  resourceCategory: string,
  expiresIn: string,
  distance: string
): Promise<void> {
  await scheduleLocalNotification(
    `🔴 ${resourceCategory} behövs`,
    `${resourceTitle} • ${distance} bort • ${expiresIn}`,
    { type: 'urgent_resource' }
  );
}
