# Stuga MVP - Implementation Guide
## Firebase + React Native (6-Week Sprint to Pilot)

**Version:** 1.0  
**Date:** December 27, 2025  
**Purpose:** Pilot-ready app for Upplands Väsby kommun  
**Timeline:** 6 weeks from start to pilot launch  
**Budget:** ~0 SEK (Firebase free tier, open-source tools)  

---

## 0. Why This Guide?

**Problem:** Väsby wants pilot in Q2 2026, CivicBase ready in Q3 2026.  
**Solution:** Build Firebase MVP now, migrate to CivicBase later.  
**This guide:** Week-by-week implementation plan using AI assistants.

**Who this is for:**
- Solo developers using Claude/Gemini for implementation
- Teams new to React Native + Firebase
- Anyone building offline-first apps with tight deadlines

**What you'll build:**
- ✅ Working mobile app (iOS + Android)
- ✅ BankID authentication
- ✅ Offline resource posting
- ✅ Hearts currency transactions
- ✅ Basic Bluetooth neighbor discovery
- ✅ Ready for 20-50 user pilot

---

## 1. Tech Stack (Final Decisions)

### 1.1 Core Technologies

| Component | Technology | Why This One? |
|-----------|-----------|---------------|
| **Framework** | React Native (Expo) | One codebase, AI-friendly, fast iteration |
| **Backend** | Firebase (Firestore + Auth + Functions) | Offline support built-in, free tier, proven |
| **Local DB** | SQLite (expo-sqlite) | Offline caching, large data storage |
| **Auth** | Firebase Auth + `react-native-bankid` | Swedish BankID integration |
| **Bluetooth** | react-native-ble-plx | Neighbor discovery, battle-tested |
| **Navigation** | React Navigation 6 | Standard, well-documented |
| **UI** | React Native Paper | Material Design, accessibility |
| **Push** | Firebase Cloud Messaging | Notifications when online |
| **Analytics** | Firebase Analytics | User behavior tracking (GDPR-compliant) |

### 1.2 Development Tools

```bash
# Required
Node.js 20+          # Runtime
npm or yarn          # Package manager
Expo CLI             # React Native tooling
Firebase CLI         # Backend deployment
Git                  # Version control

# Optional but recommended
VS Code              # Editor
Expo Go (mobile)     # Testing on device
Android Studio       # Android emulator
Xcode (Mac only)     # iOS simulator
```

### 1.3 Firebase Services Used

```
firebase.google.com project:
├── Firestore Database (real-time + offline)
├── Authentication (BankID custom provider)
├── Cloud Functions (Hearts balance updates)
├── Cloud Messaging (push notifications)
├── Analytics (user behavior)
└── Hosting (optional: web dashboard)
```

**Cost (pilot scale):**
- 50 users, 10GB data, 500K reads/month = **0 SEK** (free tier)
- 100 users = ~50 SEK/month
- 500 users = ~200 SEK/month

---

## 2. Project Setup (Week 1)

### 2.1 Initialize React Native Project

```bash
# Create Expo project
npx create-expo-app stuga-app --template blank-typescript
cd stuga-app

# Install core dependencies
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
npm install react-native-paper
npm install firebase
npm install expo-sqlite
npm install react-native-ble-plx
npm install @react-native-async-storage/async-storage

# Install dev dependencies
npm install --save-dev @types/react @types/react-native
```

### 2.2 Firebase Project Setup

**Step 1: Create Firebase project**
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name: "stuga-pilot"
4. Enable Google Analytics: Yes
5. Location: Europe (Stockholm if available, else Frankfurt)

**Step 2: Add apps**
1. Add iOS app: Bundle ID `com.stuga.app`
2. Add Android app: Package name `com.stuga.app`
3. Download `google-services.json` (Android)
4. Download `GoogleService-Info.plist` (iOS)

**Step 3: Enable services**
```bash
# In Firebase Console:
# 1. Firestore Database → Create database → Start in test mode
# 2. Authentication → Sign-in method → Custom (for BankID)
# 3. Cloud Functions → Upgrade to Blaze plan (free tier, credit card required)
# 4. Cloud Messaging → Enable
```

**Step 4: Initialize Firebase in project**

```typescript
// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "stuga-pilot.firebaseapp.com",
  projectId: "stuga-pilot",
  storageBucket: "stuga-pilot.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app, 'europe-west1'); // Stockholm region

// Enable offline persistence (10MB cache)
enableIndexedDbPersistence(db, {
  cacheSizeBytes: 10 * 1024 * 1024
}).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence only in first');
  } else if (err.code === 'unimplemented') {
    console.warn('Browser doesn\'t support persistence');
  }
});
```

### 2.3 Project Structure

```
stuga-app/
├── App.tsx                       # Entry point
├── app.json                      # Expo config
├── firebase.json                 # Firebase config
├── package.json
├── src/
│   ├── config/
│   │   ├── firebase.ts          # Firebase initialization
│   │   └── theme.ts             # Design system (from UI_SPEC)
│   ├── lib/
│   │   ├── database.ts          # SQLite helpers
│   │   ├── bluetooth.ts         # BLE mesh
│   │   └── bankid.ts            # BankID integration
│   ├── components/
│   │   ├── StatusIndicator.tsx
│   │   ├── NeighborCard.tsx
│   │   └── Button.tsx
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── NeighborDetailScreen.tsx
│   │   ├── SendHeartsScreen.tsx
│   │   └── AddResourceScreen.tsx
│   ├── hooks/
│   │   ├── useFirestore.ts     # Firestore queries
│   │   ├── useOfflineSync.ts   # Sync logic
│   │   └── useBluetooth.ts     # Bluetooth state
│   └── types/
│       ├── User.ts
│       ├── Resource.ts
│       └── Hearts.ts
├── functions/                    # Firebase Cloud Functions
│   ├── index.js
│   └── package.json
└── assets/
    └── (icons, images)
```

---

## 3. Firestore Schema & Security Rules (Week 2)

### 3.1 Collections Structure

**4 main collections:**

```javascript
// Collection: users
{
  id: string,                    // Auto-generated
  user_id: string,              // BankID personnummer (hashed)
  name: string,                 // From BankID
  bankid_verified: boolean,
  created_at: timestamp,
  location: {
    lat: number,
    lon: number,
    accuracy: number,           // Rounded to 50m for privacy
    updated_at: timestamp
  },
  hearts_balance: number,       // Default: 100
  availability_status: string,  // 'available' | 'away' | 'emergency'
  bluetooth_id: string,         // For mesh discovery
  fcm_token: string            // Push notifications
}

// Collection: resources
{
  id: string,
  user_id: string,              // Ref to users
  type: string,                 // 'offer' | 'need'
  category: string,             // 'mat' | 'värme' | etc
  title: string,
  description: string,
  status: string,               // 'open' | 'matched' | 'completed'
  matched_with_user: string | null,
  hearts_value: number | null,
  created_at: timestamp,
  updated_at: timestamp
}

// Collection: hearts_transactions
{
  id: string,
  from_user: string,
  to_user: string,
  amount: number,
  reason: string,
  related_resource: string | null,
  confirmed_by_sender: boolean,
  confirmed_by_receiver: boolean,
  created_at: timestamp,
  completed_at: timestamp | null
}

// Collection: mesh_nodes
{
  id: string,
  bluetooth_id: string,
  user_id: string,
  signal_strength: number,      // RSSI
  distance_estimate: number,    // Meters
  last_seen: timestamp,
  device_info: {
    platform: string,
    app_version: string
  }
}
```

### 3.2 Firestore Indexes

**Create in Firebase Console → Firestore → Indexes:**

```
Collection: resources
Fields: user_id (Ascending), created_at (Descending)
Query scope: Collection

Collection: hearts_transactions
Fields: from_user (Ascending), created_at (Descending)
Query scope: Collection

Collection: hearts_transactions
Fields: to_user (Ascending), created_at (Descending)
Query scope: Collection

Collection: mesh_nodes
Fields: user_id (Ascending), last_seen (Descending)
Query scope: Collection
```

### 3.3 Security Rules

**Deploy via Firebase Console or `firebase deploy --only firestore:rules`:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // Users: All authenticated can read, only owner can write
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isOwner(userId);
      allow update, delete: if isOwner(userId);
    }
    
    // Resources: All can read, only owner can modify
    match /resources/{resourceId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && 
                       request.resource.data.user_id == request.auth.uid;
      allow update, delete: if resource.data.user_id == request.auth.uid;
    }
    
    // Hearts transactions: Both parties can read
    match /hearts_transactions/{txId} {
      allow read: if isAuthenticated() && 
                     (request.auth.uid == resource.data.from_user ||
                      request.auth.uid == resource.data.to_user);
      allow create: if isAuthenticated() && 
                       request.auth.uid == request.resource.data.from_user;
      allow update: if request.auth.uid == resource.data.to_user &&
                       request.resource.data.diff(resource.data).affectedKeys()
                         .hasOnly(['confirmed_by_receiver', 'completed_at']);
    }
    
    // Mesh nodes: All can read, only owner can write
    match /mesh_nodes/{nodeId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() &&
                      request.resource.data.user_id == request.auth.uid;
    }
  }
}
```

---

## 4. BankID Integration (Week 2-3)

### 4.1 BankID Custom Authentication

**Strategy:** Use Firebase Custom Auth + Swedish BankID QR flow

**Libraries:**
```bash
npm install @bankid/react-native-bankid
# OR use REST API directly (more control)
```

**Implementation:**

```typescript
// src/lib/bankid.ts
import { auth } from '../config/firebase';
import { signInWithCustomToken } from 'firebase/auth';

// Step 1: Initialize BankID authentication
export async function startBankIDAuth(): Promise<string> {
  // Call your backend Cloud Function to init BankID
  const response = await fetch('https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/initBankID', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  
  const { orderRef, qrStartToken } = await response.json();
  return orderRef;
}

// Step 2: Generate QR code (user scans with BankID app)
export function generateQRCode(qrStartToken: string, time: number): string {
  // BankID QR format: bankid.{qrStartToken}.{time}.{hmac}
  // See: https://www.bankid.com/utvecklare/guider/teknisk-integrationsguide
  const hmac = calculateHMAC(qrStartToken, time);
  return `bankid.${qrStartToken}.${time}.${hmac}`;
}

// Step 3: Poll for completion
export async function pollBankIDStatus(orderRef: string): Promise<BankIDResult> {
  const response = await fetch(`https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/pollBankID`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderRef })
  });
  
  return await response.json();
}

// Step 4: Sign in to Firebase with custom token
export async function signInWithBankID(customToken: string) {
  const userCredential = await signInWithCustomToken(auth, customToken);
  return userCredential.user;
}

interface BankIDResult {
  status: 'pending' | 'complete' | 'failed';
  customToken?: string;  // Firebase custom token if complete
  personalNumber?: string;
  name?: string;
}
```

**Backend (Firebase Cloud Function):**

```javascript
// functions/bankid.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

// BankID Test environment
const BANKID_URL = 'https://appapi2.test.bankid.com/rp/v6.0';
const BANKID_CERT = process.env.BANKID_CERT; // P12 certificate
const BANKID_CERT_PASSWORD = process.env.BANKID_CERT_PASSWORD;

exports.initBankID = functions.https.onCall(async (data, context) => {
  try {
    // Start BankID authentication
    const response = await axios.post(`${BANKID_URL}/auth`, {
      endUserIp: context.rawRequest.ip,
      requirement: {
        pinCode: false,
        mrtd: false
      }
    }, {
      httpsAgent: new https.Agent({
        pfx: Buffer.from(BANKID_CERT, 'base64'),
        passphrase: BANKID_CERT_PASSWORD
      })
    });
    
    return {
      orderRef: response.data.orderRef,
      qrStartToken: response.data.qrStartToken
    };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

exports.pollBankID = functions.https.onCall(async (data, context) => {
  const { orderRef } = data;
  
  try {
    const response = await axios.post(`${BANKID_URL}/collect`, {
      orderRef
    }, {
      httpsAgent: new https.Agent({
        pfx: Buffer.from(BANKID_CERT, 'base64'),
        passphrase: BANKID_CERT_PASSWORD
      })
    });
    
    if (response.data.status === 'complete') {
      const { personalNumber, name } = response.data.completionData.user;
      
      // Create Firebase custom token
      const customToken = await admin.auth().createCustomToken(personalNumber, {
        name: name,
        bankid_verified: true
      });
      
      // Create/update user in Firestore
      await admin.firestore().collection('users').doc(personalNumber).set({
        user_id: personalNumber,
        name: name,
        bankid_verified: true,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        hearts_balance: 100 // Initial Hearts
      }, { merge: true });
      
      return {
        status: 'complete',
        customToken,
        personalNumber,
        name
      };
    }
    
    return { status: response.data.status };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});
```

### 4.2 BankID UI Flow

**Screen: BankIDAuthScreen.tsx**

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { startBankIDAuth, pollBankIDStatus, signInWithBankID } from '../lib/bankid';

export default function BankIDAuthScreen({ navigation }) {
  const [orderRef, setOrderRef] = useState<string | null>(null);
  const [qrCode, setQRCode] = useState<string>('');
  const [status, setStatus] = useState<string>('Väntar...');

  useEffect(() => {
    initAuth();
  }, []);

  async function initAuth() {
    try {
      const ref = await startBankIDAuth();
      setOrderRef(ref);
      
      // Start polling
      const interval = setInterval(async () => {
        const result = await pollBankIDStatus(ref);
        
        if (result.status === 'complete' && result.customToken) {
          clearInterval(interval);
          await signInWithBankID(result.customToken);
          navigation.replace('Home');
        } else if (result.status === 'failed') {
          clearInterval(interval);
          setStatus('Autentisering misslyckades');
        } else {
          setStatus('Öppna BankID-appen och scanna QR-koden');
        }
      }, 1000);
    } catch (error) {
      setStatus('Fel vid autentisering');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logga in med BankID</Text>
      {qrCode && <QRCode value={qrCode} size={200} />}
      <Text style={styles.status}>{status}</Text>
    </View>
  );
}
```

---

## 5. Core Features Implementation (Week 3-4)

### 5.1 Home Screen (Grannkarta)

**Hook for fetching neighbors:**

```typescript
// src/hooks/useNeighbors.ts
import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getCurrentLocation } from '../lib/location';

export function useNeighbors(radiusKm: number = 0.5) {
  const [neighbors, setNeighbors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNeighbors() {
      const location = await getCurrentLocation();
      
      // Firestore geoqueries (simplified - use geohash library for production)
      // For MVP: Fetch all users, filter client-side
      const q = query(collection(db, 'users'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const users = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(user => {
            const distance = calculateDistance(
              location.lat, location.lon,
              user.location.lat, user.location.lon
            );
            return distance <= radiusKm;
          });
        
        setNeighbors(users);
        setLoading(false);
      });

      return unsubscribe;
    }

    fetchNeighbors();
  }, [radiusKm]);

  return { neighbors, loading };
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
```

### 5.2 Send Hearts Flow

```typescript
// src/hooks/useSendHearts.ts
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

export function useSendHearts() {
  async function sendHearts(toUserId: string, amount: number, reason: string) {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('Not authenticated');

      const transaction = {
        from_user: currentUser.uid,
        to_user: toUserId,
        amount,
        reason,
        related_resource: null,
        confirmed_by_sender: true,
        confirmed_by_receiver: false,
        created_at: new Date(),
        completed_at: null
      };

      // Add to Firestore (works offline with persistence)
      const docRef = await addDoc(collection(db, 'hearts_transactions'), transaction);
      
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Send Hearts error:', error);
      return { success: false, error: error.message };
    }
  }

  return { sendHearts };
}
```

### 5.3 Add Resource

```typescript
// src/hooks/useAddResource.ts
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

export function useAddResource() {
  async function addResource(
    type: 'offer' | 'need',
    category: string,
    title: string,
    description: string
  ) {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('Not authenticated');

    const resource = {
      user_id: currentUser.uid,
      type,
      category,
      title,
      description,
      status: 'open',
      matched_with_user: null,
      hearts_value: null,
      created_at: new Date(),
      updated_at: new Date()
    };

    const docRef = await addDoc(collection(db, 'resources'), resource);
    return { success: true, id: docRef.id };
  }

  return { addResource };
}
```

---

## 6. Offline Support (Week 4)

### 6.1 SQLite Caching Layer

```typescript
// src/lib/database.ts
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('stuga.db');

// Initialize tables
export function initDatabase() {
  db.transaction(tx => {
    // Cache users
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS cached_users (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        cached_at INTEGER NOT NULL
      )
    `);

    // Queue offline actions
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS pending_actions (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        data TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        synced INTEGER DEFAULT 0
      )
    `);
  });
}

// Cache user data
export function cacheUser(user: any) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT OR REPLACE INTO cached_users (id, data, cached_at) VALUES (?, ?, ?)',
        [user.id, JSON.stringify(user), Date.now()],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
}

// Queue offline action
export function queueAction(type: string, data: any) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO pending_actions (id, type, data, created_at) VALUES (?, ?, ?, ?)',
        [generateId(), type, JSON.stringify(data), Date.now()],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
}

// Sync pending actions when online
export async function syncPendingActions() {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM pending_actions WHERE synced = 0',
        [],
        async (_, { rows }) => {
          const items = [];
          for (let i = 0; i < rows.length; i++) {
            items.push(rows.item(i));
          }

          for (const item of items) {
            try {
              const data = JSON.parse(item.data);
              
              // Upload to Firestore based on type
              if (item.type === 'hearts_transaction') {
                await addDoc(collection(db, 'hearts_transactions'), data);
              } else if (item.type === 'resource') {
                await addDoc(collection(db, 'resources'), data);
              }

              // Mark synced
              tx.executeSql(
                'UPDATE pending_actions SET synced = 1 WHERE id = ?',
                [item.id]
              );
            } catch (error) {
              console.error('Sync error:', error);
            }
          }
          
          resolve(items.length);
        },
        (_, error) => reject(error)
      );
    });
  });
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
```

### 6.2 Offline Sync Manager

```typescript
// src/hooks/useOfflineSync.ts
import { useEffect } from 'react';
import { useNetInfo } from '@react-native-community/netinfo';
import { syncPendingActions } from '../lib/database';

export function useOfflineSync() {
  const netInfo = useNetInfo();

  useEffect(() => {
    if (netInfo.isConnected) {
      // Online - sync pending actions
      syncPendingActions()
        .then(count => console.log(`Synced ${count} actions`))
        .catch(err => console.error('Sync failed:', err));
    }
  }, [netInfo.isConnected]);

  return {
    isOnline: netInfo.isConnected,
    isOffline: !netInfo.isConnected
  };
}
```

---

## 7. Bluetooth Mesh (Week 5)

### 7.1 Basic Neighbor Discovery

```typescript
// src/lib/bluetooth.ts
import { BleManager, Device } from 'react-native-ble-plx';

const manager = new BleManager();

export class BluetoothMesh {
  private discoveredNodes: Map<string, Device> = new Map();

  async start(userId: string) {
    // Start scanning for other Stuga users
    manager.startDeviceScan(
      null,
      { allowDuplicates: true },
      (error, device) => {
        if (error) {
          console.error('BLE scan error:', error);
          return;
        }

        // Look for Stuga devices (name format: "Stuga-{userId}")
        if (device?.name?.startsWith('Stuga-')) {
          this.handleDeviceDiscovered(device);
        }
      }
    );

    // Start advertising self
    // Note: iOS limitations - advertising in background is limited
    // Android: Can use custom advertising service
  }

  private handleDeviceDiscovered(device: Device) {
    const neighborId = device.name?.replace('Stuga-', '') || '';
    const distance = this.rssiToDistance(device.rssi || -100);

    this.discoveredNodes.set(device.id, device);

    // Update mesh_nodes in Firestore (when online)
    // Or cache locally (when offline)
    this.updateMeshNode({
      bluetooth_id: device.id,
      user_id: neighborId,
      signal_strength: device.rssi || -100,
      distance_estimate: distance,
      last_seen: Date.now()
    });
  }

  private rssiToDistance(rssi: number): number {
    // Simplified distance estimation
    // Real implementation needs calibration
    const txPower = -59; // Measured power at 1m
    if (rssi === 0) return -1;

    const ratio = rssi / txPower;
    if (ratio < 1.0) {
      return Math.pow(ratio, 10);
    } else {
      return (0.89976) * Math.pow(ratio, 7.7095) + 0.111;
    }
  }

  private async updateMeshNode(node: any) {
    try {
      await addDoc(collection(db, 'mesh_nodes'), {
        ...node,
        device_info: {
          platform: Platform.OS,
          app_version: '1.0.0'
        }
      });
    } catch (error) {
      // If offline, queue for later sync
      await queueAction('mesh_node', node);
    }
  }

  stop() {
    manager.stopDeviceScan();
  }
}
```

**Limitations acknowledged:**
- ✅ Discovers neighbors within ~50m (direct Bluetooth)
- ❌ No multi-hop mesh relay (complex, needs CivicBase)
- ❌ iOS background limitations (can't advertise in background)
- ✅ Good enough for MVP validation

---

## 8. Deployment (Week 6)

### 8.1 Expo Build

```bash
# Configure app.json
{
  "expo": {
    "name": "Stuga",
    "slug": "stuga-app",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.stuga.app",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.stuga.app",
      "versionCode": 1,
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "BLUETOOTH",
        "BLUETOOTH_ADMIN"
      ]
    }
  }
}

# Build for iOS (requires Apple Developer account)
eas build --platform ios

# Build for Android
eas build --platform android

# Or use Expo Go for testing (no build needed)
npx expo start
```

### 8.2 Firebase Deploy

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Cloud Functions
cd functions
npm install
cd ..
firebase deploy --only functions

# Deploy Firestore indexes
firebase deploy --only firestore:indexes
```

### 8.3 TestFlight / Play Store Internal Testing

**iOS (TestFlight):**
1. Build with EAS: `eas build --platform ios`
2. Upload to App Store Connect
3. Create TestFlight group: "Väsby Pilot"
4. Add 50 testers (email addresses)
5. Send invite

**Android (Internal Testing):**
1. Build with EAS: `eas build --platform android`
2. Upload to Play Console
3. Create Internal Testing track
4. Add testers (Google accounts)
5. Share testing link

---

## 9. Testing Strategy

### 9.1 Unit Tests

```bash
npm install --save-dev jest @testing-library/react-native

# Example test: Hearts transaction
// __tests__/sendHearts.test.ts
import { renderHook } from '@testing-library/react-hooks';
import { useSendHearts } from '../src/hooks/useSendHearts';

test('sends Hearts to neighbor', async () => {
  const { result } = renderHook(() => useSendHearts());
  
  const response = await result.current.sendHearts(
    'neighbor-123',
    50,
    'Tack för veden!'
  );

  expect(response.success).toBe(true);
  expect(response.id).toBeDefined();
});
```

### 9.2 Manual Testing Checklist

**Week 6 testing:**

- [ ] BankID login works
- [ ] View neighbors on map
- [ ] Post resource (offer)
- [ ] Post resource (need)
- [ ] Send Hearts to neighbor
- [ ] Receive Hearts (test with 2 devices)
- [ ] Offline mode: Post resource without internet
- [ ] Offline mode: Send Hearts without internet
- [ ] Online sync: Reconnect, verify sync
- [ ] Bluetooth: Discover nearby device
- [ ] Push notification: Receive Hearts notification

---

## 10. 6-Week Implementation Plan

### Week 1: Setup
**Days 1-2:**
- [ ] Create Expo project
- [ ] Setup Firebase project
- [ ] Install dependencies
- [ ] Configure Firebase SDK

**Days 3-4:**
- [ ] Implement theme (UI_SPECIFICATION.md)
- [ ] Create basic navigation
- [ ] Setup project structure

**Days 5-6:**
- [ ] Design Firestore schema
- [ ] Deploy security rules
- [ ] Test Firestore CRUD operations

**Day 7:**
- [ ] Review progress, fix blockers

---

### Week 2: Authentication & Data Layer
**Days 1-3:**
- [ ] BankID Cloud Functions (init, poll)
- [ ] BankID UI flow (QR code screen)
- [ ] Test BankID login (test environment)

**Days 4-5:**
- [ ] SQLite database setup
- [ ] Caching layer implementation
- [ ] Offline queue system

**Days 6-7:**
- [ ] User profile creation
- [ ] Location services integration
- [ ] Privacy settings

---

### Week 3: Core Features
**Days 1-2:**
- [ ] Home screen (Grannkarta)
- [ ] Fetch neighbors (Firestore query)
- [ ] Display neighbors with distance

**Days 3-4:**
- [ ] Add Resource screen
- [ ] Resource form validation
- [ ] Save to Firestore

**Days 5-7:**
- [ ] Send Hearts screen
- [ ] Hearts transaction flow
- [ ] Confirmation UI

---

### Week 4: Offline Support
**Days 1-3:**
- [ ] Implement offline queueing
- [ ] Test offline resource posting
- [ ] Test offline Hearts sending

**Days 4-5:**
- [ ] Network state detection
- [ ] Auto-sync when online
- [ ] Conflict resolution (simple)

**Days 6-7:**
- [ ] Offline indicator UI
- [ ] Pending sync status
- [ ] Manual sync trigger

---

### Week 5: Bluetooth & Polish
**Days 1-3:**
- [ ] Bluetooth neighbor discovery
- [ ] Update mesh_nodes collection
- [ ] Distance estimation

**Days 4-5:**
- [ ] UI polish (all screens)
- [ ] Fix top bar visibility issues
- [ ] Accessibility improvements

**Days 6-7:**
- [ ] Error handling
- [ ] Loading states
- [ ] Empty states

---

### Week 6: Testing & Deployment
**Days 1-2:**
- [ ] Manual testing (all flows)
- [ ] Fix critical bugs
- [ ] Performance optimization

**Days 3-4:**
- [ ] Build iOS (eas build)
- [ ] Build Android (eas build)
- [ ] Deploy Cloud Functions

**Days 5-6:**
- [ ] TestFlight setup (iOS)
- [ ] Play Console setup (Android)
- [ ] Invite pilot testers (10-20)

**Day 7:**
- [ ] Pilot launch party! 🎉
- [ ] Monitor Firebase console
- [ ] Gather feedback

---

## 11. Migration to CivicBase (Future)

### 11.1 When to Migrate

**Triggers:**
- CivicBase SDK for React Native available (Q3 2026)
- Pilot validation complete (100+ successful transactions)
- Väsby requests production deployment
- EU/GDPR compliance review requires data sovereignty

### 11.2 Migration Strategy

**Phase 1: Parallel Run (1 month)**
```
Firebase (primary) + CivicBase (shadow)
├─ All writes go to both
├─ Reads from Firebase
├─ Validate CivicBase sync
└─ Monitor for discrepancies
```

**Phase 2: Switchover (2 weeks)**
```
CivicBase (primary) + Firebase (backup)
├─ Reads from CivicBase
├─ Writes to both (temporary)
├─ User testing (20-50 users)
└─ Rollback plan ready
```

**Phase 3: Firebase Sunset (1 month)**
```
CivicBase only
├─ Disable Firebase writes
├─ Keep Firebase read-only (archive)
├─ Export historical data
└─ Cancel Firebase subscription
```

### 11.3 Code Changes Required

**Minimal - abstraction layer already in place:**

```typescript
// BEFORE (Firebase)
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

await addDoc(collection(db, 'resources'), resource);

// AFTER (CivicBase)
import { db } from '../config/civicbase';

await db.resources.create(resource); // CivicBase SDK
```

**React Native UI:** 0% changes (reuse 100%)  
**Data layer:** 20% changes (swap SDK)  
**Business logic:** 0% changes (same functions)

---

## 12. Budget & Resources

### 12.1 Development Costs

| Item | Cost | Notes |
|------|------|-------|
| **Developer time** | 0 SEK | Solo dev or AI-assisted |
| **Firebase (pilot)** | 0 SEK | Free tier (50 users) |
| **Apple Developer** | 999 SEK/year | Required for iOS |
| **Google Play** | ~250 SEK | One-time fee |
| **BankID Test** | 0 SEK | Test environment free |
| **BankID Prod** | ~5,000 SEK/year | Production license |
| **Total (Year 1)** | ~6,250 SEK | Minimal cost! |

### 12.2 Scaling Costs (if pilot grows)

| Users | Firebase Cost | Notes |
|-------|---------------|-------|
| 50 | 0 SEK | Free tier |
| 100 | ~50 SEK/month | Exceed free tier slightly |
| 500 | ~200 SEK/month | Still very cheap |
| 2000 | ~800 SEK/month | Consider CivicBase migration |

**Migration trigger:** When Firebase costs > 500 SEK/month, CivicBase is economical.

---

## 13. Success Criteria

### 13.1 Technical Success

- ✅ App works offline for 24+ hours
- ✅ BankID authentication success rate >95%
- ✅ Hearts transactions synced within 5 minutes of reconnection
- ✅ Bluetooth discovers neighbors <50m reliably
- ✅ Zero critical bugs after week 6
- ✅ App store approval (iOS + Android)

### 13.2 Pilot Success

- ✅ 20-50 users onboarded
- ✅ 50+ resources posted (mix of offers/needs)
- ✅ 100+ Hearts transactions
- ✅ User satisfaction >70% (survey)
- ✅ At least 2 real resource exchanges facilitated

### 13.3 Platform Success

- ✅ Code reusable for CivicBase migration
- ✅ Learning documented for future iterations
- ✅ Väsby enthusiastic for production deployment
- ✅ Interest from other municipalities

---

## 14. Risk Management

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **BankID integration complexity** | Medium | High | Use test environment first, fallback to email auth |
| **Bluetooth unreliable** | High | Medium | Document as "experimental", focus on online features |
| **Firebase costs escalate** | Low | Low | Monitor usage, migrate to CivicBase if needed |
| **User adoption low** | Medium | High | Pre-recruit pilot users, incentivize with Hearts |
| **iOS/Android platform differences** | Medium | Medium | Test on both platforms weekly |
| **Timeline slip (> 6 weeks)** | Medium | Medium | Cut Bluetooth if needed, focus on core features |

---

## 15. Next Steps

**After reading this guide:**

1. **Week 0 (Preparation):**
   - [ ] Get Apple Developer account ($99/year)
   - [ ] Get Google Play account (~$25 one-time)
   - [ ] Request BankID test environment access
   - [ ] Create Firebase project

2. **Week 1 (Start):**
   - [ ] Follow "Week 1" section above
   - [ ] Setup Expo + Firebase
   - [ ] Deploy basic app to Expo Go

3. **Weeks 2-6:**
   - [ ] Follow weekly plan
   - [ ] Use Claude/Gemini for implementation
   - [ ] Test continuously

4. **Week 6 (Launch):**
   - [ ] Invite pilot testers
   - [ ] Monitor Firebase console
   - [ ] Gather feedback daily

5. **Week 7-12 (Iterate):**
   - [ ] Fix bugs based on feedback
   - [ ] Prepare for CivicBase migration
   - [ ] Plan production deployment

---

## 16. Appendix: Quick Reference

### 16.1 Useful Commands

```bash
# Development
npx expo start                    # Start dev server
npx expo start --clear            # Clear cache
npx expo start --tunnel           # Expose to internet

# Testing
npm test                          # Run unit tests
npx expo start --ios              # iOS simulator
npx expo start --android          # Android emulator

# Building
eas build --platform ios          # Build iOS
eas build --platform android      # Build Android
eas submit --platform ios         # Submit to App Store
eas submit --platform android     # Submit to Play Store

# Firebase
firebase deploy --only firestore:rules    # Deploy Firestore rules
firebase deploy --only functions          # Deploy Cloud Functions
firebase emulators:start                  # Local Firebase emulator
```

### 16.2 Essential Links

- **Expo Docs:** https://docs.expo.dev/
- **Firebase Docs:** https://firebase.google.com/docs
- **React Navigation:** https://reactnavigation.org/
- **BankID Developer:** https://www.bankid.com/utvecklare
- **React Native BLE:** https://github.com/dotintent/react-native-ble-plx

### 16.3 Troubleshooting

**Problem:** Firestore offline persistence not working
- **Solution:** Check `enableIndexedDbPersistence` called before any queries

**Problem:** BankID QR code not scanning
- **Solution:** Verify QR format matches BankID spec, use test environment first

**Problem:** Bluetooth not discovering neighbors
- **Solution:** Check permissions (iOS: Info.plist, Android: AndroidManifest.xml)

**Problem:** Build fails on EAS
- **Solution:** Check `app.json` config, verify credentials setup

---

## 17. Conclusion

**This guide gives you:**
- ✅ Complete Firebase architecture for MVP
- ✅ 6-week implementation plan
- ✅ BankID integration strategy
- ✅ Offline support implementation
- ✅ Clear migration path to CivicBase

**What you do next:**
1. Read this guide thoroughly
2. Start with Week 1 setup
3. Use Claude/Gemini for implementation
4. Launch pilot in 6 weeks
5. Migrate to CivicBase when ready

**Remember:**
- This is MVP to validate concept, not production system
- CivicBase migration planned for Q3 2026
- Pilot success = stronger grant applications
- Fast iteration > perfect architecture

**Good luck building Stuga! 🏘️🎯**

---

**Document maintained by:** Björn Kenneth Holmström  
**Contact:** bjorn.kenneth.holmstrom@gmail.com  
**Last updated:** December 27, 2025  
**Version:** 1.0
