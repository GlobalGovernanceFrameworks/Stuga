# Stuga UI Specification
## Brutal Minimalism for Crisis Coordination

**Design Philosophy:** "Swish for Neighbors"  
**Target:** Works for ages 7-90 in a power outage  
**Inspiration:** Swish, SOS Alarm, BankID  
**Constraints:** Must work on 5-year-old Android phone with cracked screen  
**Development:** AI-assisted (Claude generates React Native components)

**Version:** 2.0 (Revised for two-phase deployment)

---

## 📱 MVP vs Production Features

**This UI spec describes the COMPLETE vision, but features are rolled out in two phases:**

### Phase 1: MVP (Q2 2026)
**Core features only** - validate concept with Väsby pilot
- ✅ Home screen (neighbor map)
- ✅ Resource posting (offer/need)
- ✅ Hearts sending
- ✅ Basic settings
- ✅ Swedish language

### Phase 2: Production (Q4 2026+)
**Enhanced features** - after CivicBase migration
- ✅ Improved offline indicators
- ✅ True mesh visualization
- ✅ Advanced Bluetooth discovery
- ✅ FRG coordinator features
- ✅ English translation

**UI components stay 90%+ the same - backend upgrades transparently.**

---

## Design Principles

### 1. No Internet Required (Offline-First UI)

**Challenge:** How do you design UI that doesn't assume connectivity?

**Solutions:**
- ✅ Clear offline/online indicators
- ✅ Optimistic UI (assume success, sync later)
- ✅ Mesh status visualization (Production only)
- ✅ "Last synced" timestamps

**MVP:** Firebase offline persistence (delayed sync indicators)  
**Production:** True mesh status (real-time P2P indicators)

### 2. Crisis-Appropriate Tone

**Not:** Playful, cute, gamified  
**Yes:** Calm, clear, trustworthy

**Color palette:**
- Primary: Forest Green (#2D5016) - stability, safety
- Secondary: Warm Orange (#FF6B35) - urgency without alarm
- Success: Soft Green (#6BCF7F)
- Warning: Amber (#FFA500)
- Danger: Deep Red (#C1121F)
- Neutral: Warm Gray (#F5F3F0)

**Typography:**
- Headers: System font (native platform)
- Body: 16px minimum (accessibility)
- Buttons: 18px minimum (easy tap targets)

### 3. Government Accessibility Standards

**WCAG 2.1 AA Compliance:**
- Contrast ratio ≥4.5:1
- Tap targets ≥44x44 points
- Screen reader compatible
- Keyboard navigation (for elderly)

### 4. Language

**MVP:** Swedish only  
**Production:** Swedish primary, English secondary

All MVP UI text in Swedish:
- "Skicka Hearts" (not "Send Hearts")
- "Grannkarta" (not "Neighbor Map")
- "Resurs" (not "Resource")

English toggle available in Production version (Settings).

---

## Core Screens (6 Total - Same for MVP and Production)

### Screen 1: HOME / GRANNKARTA

**Purpose:** See who's nearby and what they need/offer

```
┌─────────────────────────────────┐
│ ☰  Stuga           🌐 Online    │  ← Status indicator (MVP: Firebase)
├─────────────────────────────────┤
│                                 │
│  📍 GRANNAR (12 INOM 500M)      │
│                                 │
│  🟢 Anna Svensson      50m ↗️   │  ← Distance + direction
│     Erbjuder: Ved, Generator    │
│     🔥 245 Hearts               │
│                                 │
│  🟢 Sven Andersson    120m ↙️   │
│     Behöver: Mat, Värme         │
│     🔥 180 Hearts               │
│                                 │
│  🟡 Maria Johansson   350m ↖️   │  ← Yellow = further away
│     Erbjuder: Matlagning        │  ← (MVP: all same color)
│     🔥 320 Hearts               │  ← (Production: mesh hops indicated)
│                                 │
│  🔴 Erik Nilsson     480m ↘️    │  ← Red = mesh hops (Production only)
│     Behöver: Verktyg            │
│     🔥 95 Hearts                │
│                                 │
├─────────────────────────────────┤
│  [➕ Lägg till resurs]          │
│  [💖 Skicka Hearts]             │
├─────────────────────────────────┤
│  Senast synkad: 2 tim sedan     │  ← MVP: Firebase sync
│  🔵🔵🔵⚪️⚪️ (3 noder nåbara)    │  ← Production: Mesh visualization
└─────────────────────────────────┘
```

**Key Decisions:**
- **Green/Yellow/Red dots:** 
  - MVP: All green (simple)
  - Production: Color codes mesh quality
- **Distance + Direction:** GPS-based (both phases)
- **Hearts visible:** Builds trust (both phases)
- **Mesh status bar:** 
  - MVP: Basic "last synced" timestamp
  - Production: Real-time mesh node count
- **No chat:** Reduces complexity, forces face-to-face (both phases)

**Implementation Notes (React Native):**
```typescript
// HomeScreen.tsx
import { FlatList, View, Text } from 'react-native';
import { useNeighbors } from '@/hooks/useNeighbors';

export function HomeScreen() {
  const { neighbors, loading } = useNeighbors();
  
  return (
    <View>
      <StatusBar /> {/* Online/offline indicator */}
      <FlatList
        data={neighbors}
        renderItem={({ item }) => <NeighborCard neighbor={item} />}
      />
      <ActionButtons />
      <SyncStatus /> {/* Last synced timestamp */}
    </View>
  );
}
```

---

### Screen 2: RESURS DETALJVY (Resource Detail)

**Purpose:** See what a neighbor offers/needs

```
┌─────────────────────────────────┐
│  ← Tillbaka                     │
├─────────────────────────────────┤
│                                 │
│  Anna Svensson            🟢    │
│  [Profile Photo]                │  ← Optional in MVP
│  120m norr · 🔥 245 Hearts     │
│                                 │
├─────────────────────────────────┤
│  ERBJUDER                       │
│                                 │
│  🪵 Ved, ca 0.5 m³              │
│  "Såg träd förra veckan,        │
│   kan dela med 2-3 familjer"    │
│                                 │
│  ⚡ Generator, 5kW              │
│  "Diesel, kan köra 8h/dag.      │
│   Vi har eldvärme själva."      │
│                                 │
├─────────────────────────────────┤
│  [💬 Kontakta Anna]             │  ← Opens contact options
│  [💖 Skicka Hearts (tack)]      │
└─────────────────────────────────┘

[Tap "Kontakta Anna"] →

┌─────────────────────────────────┐
│  Kontakta Anna                  │
├─────────────────────────────────┤
│  📍 Gå dit (120m norr)          │  ← GPS navigation
│  🔔 Skicka signal               │  ← Bluetooth "ping" (Production)
│  💖 Skicka Hearts               │
│  ❌ Avbryt                      │
└─────────────────────────────────┘
```

**MVP vs Production:**
- **Profile photo:** Optional (MVP), recommended (Production)
- **"Skicka signal":** Production only (requires mesh)
- **GPS navigation:** Both phases

---

### Screen 3: LÄGG TILL RESURS (Add Resource)

**Purpose:** Post what you offer or need

```
┌─────────────────────────────────┐
│  ← Avbryt          Spara        │
├─────────────────────────────────┤
│                                 │
│  Jag...                         │
│  ○ Erbjuder   ● Behöver         │
│                                 │
│  Kategori                       │
│  ┌───────────────────────────┐ │
│  │ [Mat  🥔]  [Värme 🔥]     │ │  ← Icon buttons
│  │ [Verktyg 🔨] [Transport🚗]│ │
│  │ [Kunskap 📚] [Boende 🏠]  │ │
│  │ [Första hjälpen ⚕️] [Annat]│ │
│  └───────────────────────────┘ │
│                                 │
│  Beskrivning                    │
│  ┌───────────────────────────┐ │
│  │ Generator, 5kW            │ │
│  │ Diesel, kan köra 8h/dag   │ │  ← Max 200 characters
│  │ 25/200                    │ │
│  └───────────────────────────┘ │
│                                 │
│  [ ] Synlig för alla grannar    │  ← Privacy options
│  [✓] Synlig för FRG-medlemmar   │  ← Production feature
│  [ ] Endast nära grannar (<100m)│
│                                 │
└─────────────────────────────────┘
```

**Implementation (React Native form):**
```typescript
// AddResourceScreen.tsx
import { useState } from 'react';
import { TextInput, Switch } from 'react-native';
import { createResource } from '@/lib/firebase'; // MVP
// import { createResource } from '@civicbase/sdk'; // Production

export function AddResourceScreen() {
  const [type, setType] = useState<'offer' | 'need'>('need');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  
  const handleSave = async () => {
    await createResource({ type, category, description });
    navigation.goBack();
  };
  
  // ... render form
}
```

---

### Screen 4: SKICKA HEARTS (Send Hearts)

**Purpose:** Thank a neighbor for help

```
┌─────────────────────────────────┐
│  ← Avbryt                       │
├─────────────────────────────────┤
│                                 │
│  Skicka Hearts till:            │
│                                 │
│  Anna Svensson                  │
│  [Profile Photo]                │
│  🔥 Hennes saldo: 245 Hearts    │
│                                 │
│  Hur mycket?                    │
│  ┌───────────────────────────┐ │
│  │  ⭕️ 25    ⭕️ 50    ⭕️ 100  │ │  ← Quick select
│  │  ⭕️ Annat: [____]          │ │
│  └───────────────────────────┘ │
│                                 │
│  Varför? (valfritt)             │
│  ┌───────────────────────────┐ │
│  │ Tack för veden!           │ │
│  └───────────────────────────┘ │
│                                 │
│  🔥 Ditt saldo: 180 Hearts      │  ← Shows your balance
│  (blir 130 efter detta)         │
│                                 │
│  [Skicka 50 Hearts]             │
└─────────────────────────────────┘

[After sending] →

┌─────────────────────────────────┐
│         ✓                       │
│                                 │
│  Skickat till Anna!             │
│                                 │
│  💖 50 Hearts                   │
│  "Tack för veden!"              │
│                                 │
│  Bekräftelse kommer när Anna    │
│  är online eller synkar data.   │  ← MVP: Firebase sync
│                                 │  ← Production: Mesh sync
│  [Klar]                         │
└─────────────────────────────────┘
```

**Both phases same UI - backend handles sync differently.**

---

### Screen 5: HEARTS HISTORIK (Hearts History)

**Purpose:** See your giving/receiving history

```
┌─────────────────────────────────┐
│  ← Tillbaka                     │
├─────────────────────────────────┤
│                                 │
│  Ditt saldo: 180 Hearts         │
│  ────────────────               │
│  Senaste 30 dagarna             │
│                                 │
│  SKICKAT                        │
│                                 │
│  💚 Anna Svensson               │
│     -50 Hearts                  │
│     "Tack för veden!"           │
│     2024-12-25 14:30 ✓          │  ← Confirmed
│                                 │
│  💚 Sven Andersson              │
│     -30 Hearts                  │
│     "Hjälp med snöskottning"    │
│     2024-12-24 09:15 ⏳         │  ← Pending (offline)
│                                 │
│  MOTTAGIT                       │
│                                 │
│  💛 Maria Johansson             │
│     +75 Hearts                  │
│     "För matlagningen!"         │
│     2024-12-23 18:00 ✓          │
│                                 │
│  💛 System                      │
│     +100 Hearts                 │
│     "Välkommen till Stuga!"     │
│     2024-12-20 12:00 ✓          │
│                                 │
└─────────────────────────────────┘
```

**Pending transactions:**
- MVP: Shows ⏳ until Firebase syncs
- Production: Shows ⏳ until mesh confirms

---

### Screen 6: INSTÄLLNINGAR (Settings)

**Purpose:** Control privacy, notifications, offline behavior

```
┌─────────────────────────────────┐
│  ← Tillbaka                     │
├─────────────────────────────────┤
│  INSTÄLLNINGAR                  │
│                                 │
│  Profil                         │
│  > Min profil                   │
│  > Byt profilbild               │  ← Optional feature
│                                 │
│  Synlighet                      │
│  [✓] Synlig för grannar         │
│  [✓] Dela ungefärlig plats      │
│  [ ] Dela exakt plats           │  ← Default: off
│                                 │
│  Notifikationer                 │
│  [✓] Hearts mottagna            │
│  [✓] Nya resurser i närheten    │
│  [ ] Daglig sammanfattning      │
│                                 │
│  Offline-läge                   │  ← Production enhanced
│  [✓] Bluetooth mesh aktivt      │  ← Production only
│  [✓] Spara data vid låg batteri │
│  [ ] Endast WiFi-synk           │
│                                 │
│  FRG-medlemskap                 │  ← Production feature
│  [ ] Jag är FRG-medlem          │
│  > Gå med i lokal FRG-grupp     │
│                                 │
│  Språk                          │  ← Production feature
│  ● Svenska  ○ English           │
│                                 │
│  Om Stuga                       │
│  > Användarvillkor              │
│  > Integritetspolicy            │
│  > Kontakta support             │
│  > Version 1.0.0 (Firebase)     │  ← Shows backend
│                                 │
│  [Logga ut]                     │
└─────────────────────────────────┘
```

**MVP vs Production differences:**
- **Bluetooth mesh toggle:** Production only
- **FRG membership:** Production enhanced
- **Language:** Production adds English
- **Version shows backend:** Firebase (MVP) vs CivicBase (Production)

---

## Additional UI Components

### Offline Indicator (Persistent)

**Always visible top-right:**

**MVP (Firebase-based):**
```
🌐 Online   (green)  ← Connected to Firebase
⏳ Synkar   (yellow) ← Syncing queued data
🔌 Offline  (red)    ← No internet, using cache
```

**Production (CivicBase-based):**
```
🌐 Online   (green)  ← Internet + mesh active
📡 Mesh     (yellow) ← Mesh only, no internet
🔌 Offline  (red)    ← Neither (rare - should still work via Bluetooth)
```

**Tap indicator →**

**MVP:**
```
┌─────────────────────────────────┐
│  Nätverksstatus                 │
├─────────────────────────────────┤
│  🔌 OFFLINE-LÄGE                │
│                                 │
│  Senast online: 2 tim sedan     │
│  Cachad data: 45 grannar        │
│  Väntande transaktioner: 2      │
│                                 │
│  Stuga fungerar offline genom   │
│  cachad data. Synkronisering    │
│  sker automatiskt när internet  │
│  återvänder.                    │
│                                 │
│  [Klar]                         │
└─────────────────────────────────┘
```

**Production:**
```
┌─────────────────────────────────┐
│  Nätverksstatus                 │
├─────────────────────────────────┤
│  📡 MESH-LÄGE                   │
│                                 │
│  Senast online: 2 tim sedan     │
│  Bluetooth-mesh: Aktiv          │
│  Grannar nåbara: 3 (direkt)     │
│  Mesh-hopp: 2 grannar via relay │
│                                 │
│  Stuga fungerar fullt ut via    │
│  Bluetooth mesh-nätverk. Data   │
│  synkroniseras när internet     │
│  återvänder.                    │
│                                 │
│  [Klar]                         │
└─────────────────────────────────┘
```

### Mesh Network Visualization (Production Only)

**Bottom of Home screen:**
```
🔵🔵🔵⚪️⚪️ 3/5 noder nåbara

[Tap for detail] →

┌─────────────────────────────────┐
│  Mesh-nätverk                   │
├─────────────────────────────────┤
│                                 │
│      [Du] ●                     │
│        ╱   ╲                    │
│    ●       ●                    │
│   Anna    Sven                  │
│            ╲                    │
│             ●                   │
│           Maria                 │
│                                 │
│  Direktkontakt: 2 grannar       │
│  Via mesh (1 hopp): 1 granne    │
│  Räckvidd: ~300m                │
│                                 │
│  [Klar]                         │
└─────────────────────────────────┘
```

**Not available in MVP** (Firebase doesn't support true mesh)

---

## Onboarding Flow (Same for Both Phases)

### Step 1: Welcome

```
┌─────────────────────────────────┐
│                                 │
│       🏘️                        │
│                                 │
│  Välkommen till Stuga           │
│                                 │
│  Samordna resurser med dina     │
│  grannar under kriser - även    │
│  när internet ligger nere.      │
│                                 │
│  [Kom igång →]                  │
│  [Läs mer]                      │
│                                 │
└─────────────────────────────────┘
```

### Step 2: BankID Verification

```
┌─────────────────────────────────┐
│  Verifiera med BankID           │
├─────────────────────────────────┤
│                                 │
│  För att förhindra missbruk     │
│  kräver Stuga BankID-           │
│  verifiering.                   │
│                                 │
│  Din identitet delas INTE med   │
│  grannar - bara ditt namn.      │
│                                 │
│  [Öppna BankID →]               │
│                                 │
└─────────────────────────────────┘
```

### Step 3: Permissions

```
┌─────────────────────────────────┐
│  Tillåt plats & Bluetooth       │
├─────────────────────────────────┤
│                                 │
│  📍 Plats                       │
│  För att visa grannar i         │
│  närheten (avrundad till 50m).  │
│                                 │
│  📡 Bluetooth                   │  ← MVP: basic, Production: full mesh
│  För offline mesh-nätverk när   │
│  internet ligger nere.          │
│                                 │
│  [Tillåt & fortsätt →]          │
│                                 │
└─────────────────────────────────┘
```

### Step 4: Add First Resource

```
┌─────────────────────────────────┐
│  Lägg till en resurs            │
├─────────────────────────────────┤
│                                 │
│  Börja med att dela något du    │
│  kan erbjuda ELLER något du     │
│  skulle kunna behöva.           │
│                                 │
│  [+ Lägg till resurs]           │
│  [Hoppa över för nu]            │
│                                 │
│  💡 Tips: Även små saker        │
│  (en trädgårdsspade, hjälp med  │
│  snöskottning) är värdefulla    │
│  för grannar under kris.        │
│                                 │
└─────────────────────────────────┘
```

### Step 5: Welcome Hearts

```
┌─────────────────────────────────┐
│         🎉                      │
│                                 │
│  Du har fått 100 Hearts!        │
│                                 │
│  Hearts är Stugas sätt att      │
│  spåra ömsesidig hjälp.         │
│  Använd dem för att tacka       │
│  grannar som hjälper dig.       │
│                                 │
│  [Börja utforska →]             │
│                                 │
└─────────────────────────────────┘
```

---

## Performance & Battery

### Battery-Saving Mode (Both Phases)

**Auto-enabled at <20% battery:**
- Reduce sync frequency
- Disable background operations
- Reduce UI animations
- Monochrome mode (saves OLED power)

**User notification:**
```
⚠️ Batterisparläge aktiverat

Bakgrundssynkning reducerad.
Din plats uppdateras var 15:e minut.
```

### Data Usage

**MVP (Firebase):**

| Activity | Data Used (72h) |
|----------|----------------|
| Neighbor updates | ~5 MB (frequent sync) |
| Resource posts | ~2 MB |
| Hearts transactions | ~1 MB |
| Images (profile) | ~10 MB (optional) |
| **Total** | **~20 MB** |

**Production (CivicBase):**

| Activity | Data Used (72h) |
|----------|----------------|
| Mesh gossip | 0 bytes (Bluetooth) |
| Internet sync (when available) | ~5 MB (compressed) |
| **Total offline** | **0 MB** |

---

## Future Features (Not MVP, Maybe Production)

**Phase 3+ (2027):**
- [ ] In-app messaging (Signal-style encryption)
- [ ] Resource photos (1 photo per resource)
- [ ] Voice notes (for elderly)
- [ ] Group coordination (FRG-specific)
- [ ] Offline maps (cached OpenStreetMap)
- [ ] Resource history/archive
- [ ] Hearts leaderboard ("Top Contributors")
- [ ] Multi-language (Arabic, Somali for Swedish immigrants)

---

## AI-Assisted Implementation Notes

**For Claude/Gemini when generating React Native components:**

1. **Use TypeScript** for all components
2. **Use Expo SDK** (not bare React Native)
3. **Follow React Navigation v6** patterns
4. **Use React Native Paper** for Material Design components
5. **Implement offline-first** (optimistic UI, queue actions)
6. **Test on both iOS and Android**
7. **Keep accessibility in mind** (screen readers, large touch targets)

**Example component request to AI:**

```
Claude, create a NeighborCard component that displays:
- Neighbor name
- Distance (e.g. "120m ↗️")  
- Resources offered (truncated to 40 chars)
- Hearts balance
- Online status indicator (green/yellow/red dot)

Use React Native Paper's Card component.
Make it tappable (navigate to neighbor detail screen).
Add TypeScript types.
```

---

## Success Criteria

**UI is successful if:**

✅ 70-year-old can post a resource in <3 taps  
✅ Works on 5-year-old phone with cracked screen  
✅ Clear offline status at all times  
✅ No confusion about Hearts value (not SEK)  
✅ Passes WCAG 2.1 AA accessibility audit  
✅ <5% user error rate in pilot  
✅ Battery lasts 72+ hours with active use  
✅ Migration from Firebase → CivicBase seamless for users  

---

**END OF UI SPECIFICATION**

*Designed for crisis, optimized for offline (MVP: good enough, Production: excellent), accessible for all ages. Every screen answers: "Does this help neighbors coordinate when internet is down?"*

*UI stays 90%+ identical between Firebase MVP and CivicBase Production - only backend changes. Users see gradual improvements, not disruptive switches.*

*AI-assisted development (Claude generates React Native components) enables fast iteration and 10-week timeline to pilot.*
