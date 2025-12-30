# Stuga Prototyp

Detta är den **första UI-prototypen** av Stuga, skapad för att visualisera konceptet.

**Status:** Arkiverad - använd inte för utveckling  
**Syfte:** Demonstration och UI-exploration

**För aktiv utveckling, se:** [../stuga-app/](../stuga-app/)

Denna prototyp skapades i projekteringsfasen och ersattes av den fullständiga MVP-implementationen.

Ursprunglig README.md:

# Stuga Demo App
## React Native Prototype for Meetings

**Status:** Demo version (mock data)  
**Framework:** React Native + Expo  
**Purpose:** Show Upplands Väsby kommun & Civilförsvarsförbundet  

---

## Quick Start

### Prerequisites

```bash
# Install Node.js (v18 or higher)
# Download from: https://nodejs.org/

# Install Expo CLI globally
npm install -g expo-cli

# Install Expo Go app on your phone
# iOS: https://apps.apple.com/app/expo-go/id982107779
# Android: https://play.google.com/store/apps/details?id=host.exp.exponent
```

### Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm start

# 3. Scan QR code with:
#    - iOS: Camera app
#    - Android: Expo Go app

# The app will load on your phone!
```

### Alternative: Run in simulator

```bash
# iOS (Mac only)
npm run ios

# Android (requires Android Studio)
npm run android

# Web browser (limited functionality)
npm run web
```

---

## Features Implemented (Demo)

✅ **Home Screen (Grannkarta)**
- View 4 mock neighbors
- Distance & connection status (Green/Yellow/Red)
- Resources offered/needed
- Hearts balance
- Offline status indicator
- Mesh network status bar

✅ **Neighbor Detail**
- Profile view
- Resource details
- Contact & Send Hearts buttons

✅ **Send Hearts**
- Quick amount selection (25/50/100)
- Custom amount input
- Optional message
- Balance calculation
- Success confirmation

✅ **Add Resource**
- Type toggle (Erbjuder/Behöver)
- Category selection (8 categories)
- Description input
- Privacy options

---

## What's NOT Implemented (Yet)

❌ Real Bluetooth mesh networking  
❌ CivicBase integration  
❌ SQLite database  
❌ BankID authentication  
❌ Actual Hearts transactions  
❌ Settings screen  
❌ Hearts history  
❌ Onboarding flow  

**This is a UI/UX demo only!** All data is hardcoded in `src/data/mockData.js`

---

## Project Structure

```
stuga-app/
├── App.js                    # Main navigation
├── package.json              # Dependencies
├── app.json                  # Expo config
├── src/
│   ├── theme.js             # Design system (colors, spacing, typography)
│   ├── data/
│   │   └── mockData.js      # Mock neighbors, resources, Hearts
│   ├── components/
│   │   ├── StatusIndicator.js    # Online/Mesh/Offline badge
│   │   ├── NeighborCard.js       # Neighbor list item
│   │   └── Button.js             # Primary/Secondary buttons
│   └── screens/
│       ├── HomeScreen.js         # Main grannkarta view
│       ├── NeighborDetailScreen.js
│       ├── SendHeartsScreen.js
│       └── AddResourceScreen.js
```

---

## Design System

All styling follows `UI_SPECIFICATION.md`:

**Colors:**
- Forest Green: `#2D5016` (primary)
- Warm Orange: `#FF6B35` (Hearts)
- Background: `#F5F3F0` (neutral)

**Typography:**
- H1: 24px Bold
- H2: 20px Semibold
- Body: 16px Regular (minimum for accessibility)
- Button: 18px Semibold

**Spacing:**
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

**Touch Targets:**
- Minimum: 44x44px (iOS HIG compliance)

---

## Demo Script (for Meetings)

**1. Open app → Home Screen** (10 seconds)
- "Detta är Stuga. Här ser Anna sina grannar inom 500m."
- Point to green dots: "Direkt Bluetooth-anslutning"
- Point to yellow/red: "Via mesh-nätverk (1-2 hopp)"
- Point to top-right: "Systemet fungerar offline"

**2. Tap on Anna Svensson** (15 seconds)
- "Anna erbjuder ved och generator"
- "Man ser vad grannar kan dela under kris"
- Tap back

**3. Tap "Skicka Hearts"** (20 seconds)
- Select Anna from list (if needed)
- Tap "50 Hearts"
- Type: "Tack för hjälpen!"
- "Så enkelt att tacka grannar"
- Tap "Skicka 50 Hearts"
- "Bekräftelse när grannen är online"

**4. Tap "Lägg till resurs"** (15 seconds)
- Toggle to "Behöver"
- Tap "Värme 🔥"
- Type: "Generator eller ved"
- "Vem som helst kan posta behov"
- Tap "Spara"

**Total demo: 60 seconds** (1 minute)

---

## Customizing Mock Data

Edit `src/data/mockData.js` to change:

```javascript
// Add more neighbors
export const neighbors = [
  {
    id: 'neighbor-5',
    name: 'Ny Granne',
    distance: 250,
    direction: '↗️',
    connectionType: 'mesh-1',
    heartsBalance: 150,
    resourcesOffered: ['Verktyg'],
    resourcesNeeded: [],
    resources: [
      {
        id: 'resource-6',
        type: 'offer',
        category: 'verktyg',
        title: 'Elverktyg',
        description: 'Borrmaskin, vinkelslip, etc.',
      },
    ],
  },
  // ... existing neighbors
];
```

---

## Sharing the Demo

### Option 1: Live Demo (Best)
1. Run `npm start` on your laptop
2. Show on your phone via Expo Go
3. Advantage: Real app interaction

### Option 2: Screen Recording
```bash
# On iOS: Screen record with QuickTime
# On Android: Built-in screen recorder
# Upload to YouTube/Vimeo
```

### Option 3: Screenshots
```bash
# Take screenshots of key screens
# Include in email/presentation
```

### Option 4: Expo Publish (Advanced)
```bash
expo publish
# Generates shareable link
# Anyone with Expo Go can view
```

---

## Next Steps After Demo

**If Väsby/Civilförsvarsförbundet says yes:**

1. **Phase 1: Real Backend** (Month 1-2)
   - Integrate CivicBase SDK
   - SQLite for local storage
   - Implement sync protocol

2. **Phase 2: Offline Capability** (Month 2-3)
   - Real Bluetooth mesh (react-native-ble-plx)
   - Offline resource posting
   - Mesh network discovery

3. **Phase 3: Hearts System** (Month 3-4)
   - Peer confirmation
   - Transaction history
   - Balance tracking

4. **Phase 4: Polish** (Month 4-6)
   - BankID integration
   - Settings screen
   - Onboarding flow
   - Native app builds

---

## Troubleshooting

**"npm install" fails:**
```bash
# Clear cache and retry
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**QR code doesn't scan:**
```bash
# Make sure phone and laptop are on same WiFi
# Try tunnel mode:
expo start --tunnel
```

**App crashes on launch:**
```bash
# Check Expo Go app is updated
# Clear Expo cache:
expo start -c
```

**Styling looks wrong:**
```bash
# Restart Expo:
# Press 'r' in terminal
# Or shake phone → Reload
```

---

## License

AGPL-3.0 (matches CivicBase)

---

## Contact

**Björn Kenneth Holmström**  
bjorn.kenneth.holmstrom@gmail.com

**Projekt:**  
- CivicBase: https://github.com/GlobalGovernanceFrameworks/CivicBase
- Stuga: (This app)

---

**Built in 1 day for demo purposes. Production version follows Technical Specification.** 🎯
