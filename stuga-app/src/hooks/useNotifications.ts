import { useState, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { requestNotificationPermissions, getPushToken } from '../lib/notificationHelpers';

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    registerForPushNotifications();

    // Listen for notifications received while app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
      console.log('📬 Notification received:', notification);
    });

    // Listen for user tapping notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 Notification tapped:', response);
      handleNotificationTap(response);
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  async function registerForPushNotifications() {
    const hasPermission = await requestNotificationPermissions();
    if (hasPermission) {
      const token = await getPushToken();
      setExpoPushToken(token);
    }
  }

  function handleNotificationTap(response: Notifications.NotificationResponse) {
    const data = response.notification.request.content.data;
    
    if (data.type === 'urgent_resource') {
      // Navigate to Resources screen
      // We'll handle this in the App component
      console.log('Navigate to urgent resource');
    }
  }

  return {
    expoPushToken,
    notification
  };
}
