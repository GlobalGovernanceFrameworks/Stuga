import { useState, useEffect } from 'react';
import { bluetoothMesh } from '../lib/bluetoothMesh';
import { PermissionsAndroid, Platform } from 'react-native';

export function useBluetooth() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [nearbyDevices, setNearbyDevices] = useState<number>(0);

  useEffect(() => {
    initBluetooth();

    return () => {
      bluetoothMesh.stopScanning();
    };
  }, []);

  async function initBluetooth() {
    try {
      // Request Bluetooth permissions (Android)
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        const allGranted = Object.values(granted).every(
          status => status === PermissionsAndroid.RESULTS.GRANTED
        );

        if (!allGranted) {
          console.warn('⚠️ Bluetooth permissions not granted');
          return;
        }
      }

      const initialized = await bluetoothMesh.initialize();
      setIsInitialized(initialized);

      if (initialized) {
        startScanning();
      }
    } catch (error) {
      console.error('Bluetooth init error:', error);
    }
  }

  function startScanning() {
    setIsScanning(true);
    bluetoothMesh.startScanning((device, rssi) => {
      // Update nearby device count
      const devices = bluetoothMesh.getDiscoveredDevices();
      setNearbyDevices(devices.length);
    });
  }

  function stopScanning() {
    setIsScanning(false);
    bluetoothMesh.stopScanning();
  }

  return {
    isInitialized,
    isScanning,
    nearbyDevices,
    startScanning,
    stopScanning
  };
}
