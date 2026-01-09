**Ah! That's the issue - `react-native-ble-plx` requires native code that Expo Go doesn't include.**

## Two options:

### Option 1: Create Development Build (recommended, 10 min)

Expo Go doesn't support Bluetooth. We need a custom build:

```bash
cd ~/Code/ggf/Stuga/stuga-app

# Install EAS CLI if you haven't
npm install -g eas-cli

# Login to Expo
eas login

# Build for Android (development build)
eas build --profile development --platform android

# This will:
# 1. Build a custom APK with Bluetooth support
# 2. Takes ~10-15 minutes
# 3. You download and install the APK
# 4. Then run: npx expo start --dev-client
```

### Option 2: Postpone Bluetooth (quick)

Comment out Bluetooth for now, test with 2nd phone tomorrow:

**In `src/screens/HomeScreen.tsx`:**

```typescript
// Temporarily disable Bluetooth
// const { isInitialized: btInitialized, isScanning: btScanning, nearbyDevices } = useBluetooth();
const btInitialized = false;
const btScanning = false;
const nearbyDevices = 0;
```

**Why this happens:**
- Expo Go = generic runtime, doesn't include all native modules
- Bluetooth = requires native code
- Solution = custom development build (includes your specific native modules)

**My recommendation:**

**Option 2 for today** (comment it out, continue with other features)

**Tomorrow when you have mom's phone:**
1. Build the development build with `eas build`
2. Install on both phones
3. Test Bluetooth properly

**OR Option 3: Skip Bluetooth entirely for MVP**

Honestly, for the demo to Francisca:
- GPS-based neighbor discovery is enough ✅
- "Bluetooth coming soon" is fine
- Focus on offline Hearts/resources (already works!)
- Full mesh is Phase 2 (CivicBase) anyway

**What do you want to do?**
- Build development build now? (15 min wait)
- Comment out and skip Bluetooth for MVP?
- Something else?
