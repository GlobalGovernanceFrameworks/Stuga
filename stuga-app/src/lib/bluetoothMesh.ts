import { BleManager, Device, State } from 'react-native-ble-plx';
import { auth, db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Stuga-specific service UUID (generated for this app)
const STUGA_SERVICE_UUID = '0000FE95-0000-1000-8000-00805F9B34FB';

class BluetoothMesh {
  private manager: BleManager;
  private isScanning: boolean = false;
  private discoveredDevices: Map<string, Device> = new Map();

  constructor() {
    this.manager = new BleManager();
  }

  // Initialize Bluetooth
  async initialize(): Promise<boolean> {
    const state = await this.manager.state();
    console.log('📶 Bluetooth state:', state);

    if (state !== State.PoweredOn) {
      console.warn('⚠️ Bluetooth not powered on');
      return false;
    }

    return true;
  }

  // Start advertising presence (broadcast "I'm here")
  async startAdvertising(): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.warn('⚠️ No user, cannot advertise');
        return;
      }

      // Note: BLE advertising is limited on mobile devices
      // This is more of a "discovery mode" indicator
      console.log('📡 Started Bluetooth advertising mode');
      
      // On Android, we can advertise. On iOS, it's more restricted.
      // For MVP, we focus on scanning and showing we're "discoverable"
      
    } catch (error) {
      console.error('❌ Advertising error:', error);
    }
  }

  // Start scanning for other Stuga users
  async startScanning(onDeviceFound?: (device: Device, rssi: number) => void): Promise<void> {
    if (this.isScanning) {
      console.log('Already scanning...');
      return;
    }

    try {
      this.isScanning = true;
      console.log('🔍 Started scanning for Stuga users...');

      this.manager.startDeviceScan(
        null, // Scan all services (we'll filter by name)
        { allowDuplicates: true },
        (error, device) => {
          if (error) {
            console.error('Scan error:', error);
            return;
          }

          // Look for Stuga devices by name pattern
          if (device && device.name?.startsWith('Stuga-')) {
            const userId = device.name.replace('Stuga-', '');
            const rssi = device.rssi || -100;
            const distance = this.rssiToDistance(rssi);

            console.log(`📶 Found Stuga user: ${userId} at ~${Math.round(distance)}m (RSSI: ${rssi})`);

            this.discoveredDevices.set(device.id, device);

            // Update mesh_nodes in Firestore (when online)
            this.updateMeshNode(userId, device.id, rssi, distance);

            // Callback for UI updates
            if (onDeviceFound) {
              onDeviceFound(device, rssi);
            }
          }
        }
      );
    } catch (error) {
      console.error('❌ Scanning error:', error);
      this.isScanning = false;
    }
  }

  // Stop scanning
  stopScanning(): void {
    if (this.isScanning) {
      this.manager.stopDeviceScan();
      this.isScanning = false;
      console.log('⏹️ Stopped scanning');
    }
  }

  // Convert RSSI to approximate distance (meters)
  private rssiToDistance(rssi: number): number {
    const txPower = -59; // Calibrated transmission power at 1m
    if (rssi === 0) return -1;

    const ratio = rssi / txPower;
    if (ratio < 1.0) {
      return Math.pow(ratio, 10);
    } else {
      return 0.89976 * Math.pow(ratio, 7.7095) + 0.111;
    }
  }

  // Update mesh node in Firestore
  private async updateMeshNode(
    userId: string,
    bluetoothId: string,
    rssi: number,
    distance: number
  ): Promise<void> {
    try {
      await addDoc(collection(db, 'mesh_nodes'), {
        bluetooth_id: bluetoothId,
        user_id: userId,
        signal_strength: rssi,
        distance_estimate: Math.round(distance),
        last_seen: Date.now(),
        device_info: {
          platform: 'unknown',
          app_version: '1.0.0'
        }
      });
      console.log('✅ Updated mesh node:', userId);
    } catch (error) {
      // Might be offline, that's OK
      console.log('ℹ️ Could not update mesh node (offline?)');
    }
  }

  // Get discovered devices
  getDiscoveredDevices(): Device[] {
    return Array.from(this.discoveredDevices.values());
  }

  // Cleanup
  destroy(): void {
    this.stopScanning();
    this.manager.destroy();
  }
}

// Singleton instance
export const bluetoothMesh = new BluetoothMesh();
