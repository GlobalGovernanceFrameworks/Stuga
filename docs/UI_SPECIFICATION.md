# Stuga UI Specification
## Brutal Minimalism for Crisis Coordination

**Design Philosophy:** "Swish for Neighbors"  
**Target:** Works for ages 7-90 in a power outage  
**Inspiration:** Swish, SOS Alarm, BankID  
**Constraints:** Must work on 5-year-old Android phone with cracked screen  

---

## Design Principles

### 1. No Internet Required (Offline-First UI)

**Challenge:** How do you design UI that doesn't assume connectivity?

**Solutions:**
- ✅ Clear offline/online indicators
- ✅ Optimistic UI (assume success, sync later)
- ✅ Mesh status visualization
- ✅ "Last synced" timestamps

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

**Swedish primary, English secondary**

All UI text in Swedish by default:
- "Skicka Hearts" (not "Send Hearts")
- "Grannkarta" (not "Neighbor Map")
- "Resurs" (not "Resource")

English toggle available (Settings).

---

## Core Screens (6 Total)

### Screen 1: HOME / GRANNKARTA

**Purpose:** See who's nearby and what they need/offer

```
┌─────────────────────────────────┐
│ ☰  Stuga           🔌 Offline   │  ← Status indicator
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
│  🟡 Maria Johansson   350m ↖️   │  ← Yellow = via mesh (1 hop)
│     Erbjuder: Matlagning        │
│     🔥 320 Hearts               │
│                                 │
│  🔴 Erik Nilsson     480m ↘️    │  ← Red = via mesh (2+ hops)
│     Behöver: Verktyg            │
│     🔥 95 Hearts                │
│                                 │
├─────────────────────────────────┤
│  [➕ Lägg till resurs]          │
│  [💖 Skicka Hearts]             │
├─────────────────────────────────┤
│  Senast synkad: 2 tim sedan     │  ← Offline awareness
│  🔵🔵🔵⚪️⚪️ (3 noder nåbara)    │  ← Mesh network status
└─────────────────────────────────┘
```

**Key Decisions:**
- **Green/Yellow/Red dots:** Immediate visual signal of connection quality
- **Distance + Direction:** Helps with physical coordination
- **Hearts visible:** Builds trust in active contributors
- **Mesh status bar:** Users understand network quality
- **No chat:** Reduces complexity, forces face-to-face (builds community)

**Interaction:**
- Tap neighbor → View profile + resources
- Swipe down → Refresh (if online)
- Pull-to-refresh animation shows mesh sync, not internet

---

### Screen 2: RESURS DETALJVY (Resource Detail)

**Purpose:** See what a neighbor offers/needs

```
┌─────────────────────────────────┐
│  ← Tillbaka                     │
├─────────────────────────────────┤
│                                 │
│  Anna Svensson            🟢    │
│  [Profile Photo]                │
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
│  [💬 Kontakta Anna]             │  ← Opens simple contact sheet
│  [💖 Skicka Hearts (tack)]      │
└─────────────────────────────────┘

[Tap "Kontakta Anna"] →

┌─────────────────────────────────┐
│  Kontakta Anna                  │
├─────────────────────────────────┤
│  📍 Gå dit (120m norr)          │  ← GPS navigation
│  🔔 Skicka signal               │  ← Bluetooth "ping"
│  💖 Skicka Hearts               │  ← Jump to Hearts flow
│  ❌ Avbryt                      │
└─────────────────────────────────┘
```

**Key Decisions:**
- **No in-app messaging:** Forces physical meeting (builds trust, reduces screen time)
- **"Skicka signal" (Bluetooth ping):** Simple "I'm interested" without text
- **GPS navigation:** Helps find neighbor in dark/snow
- **Hearts as gratitude:** Simple thank-you mechanism

---

### Screen 3: LÄGG TILL RESURS (Add Resource)

**Purpose:** Post what you offer or need

```
┌──────────────────────────────────┐
│  ← Avbryt          Spara         │
├──────────────────────────────────┤
│                                  │
│  Jag...                          │
│  ○ Erbjuder   ● Behöver          │
│                                  │
│  Kategori                        │
│  ┌────────────────────────────┐  │
│  │ [Mat  🥔]  [Värme 🔥]      │  │  ← Icon buttons
│  │ [Verktyg 🔨] [Transport🚗] │  │
│  │ [Kunskap 📚] [Boende 🏠]   │  │
│  │ [Första hjälpen ⚕️] [Annat]│  │
│  └────────────────────────────┘  │
│                                  │
│  Beskrivning                     │
│  ┌───────────────────────────┐   │
│  │ Generator, 5kW            │   │
│  │ Diesel, kan köra 8h/dag   │   │  ← Max 200 characters
│  │ 25/200                    │   │
│  └───────────────────────────┘   │
│                                  │
│  [ ] Synlig för alla grannar     │  ← Privacy option
│  [✓] Synlig för FRG-medlemmar    │
│  [ ] Endast nära grannar (<100m) │
│                                  │
└──────────────────────────────────┘
```

**Key Decisions:**
- **Icons + text:** Works for low-literacy users
- **Character limit:** Forces conciseness
- **Privacy toggles:** User controls visibility
- **No photos (MVP):** Reduces complexity, saves battery
- **Offline creation:** Saved locally, synced later

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
│  ┌───────────────────────────┐  │
│  │  ⭕️ 25    ⭕️ 50    ⭕️ 10  │  │  ← Quick select
│  │  ⭕️ Annat: [____]         │  │
│  └───────────────────────────┘  │
│                                 │
│  Varför? (valfritt)             │
│  ┌───────────────────────────┐  │
│  │ Tack för veden!           │  │
│  └───────────────────────────┘  │
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
│  är online eller inom Bluetooth-│
│  räckvidd.                      │
│                                 │
│  [Klar]                         │
└─────────────────────────────────┘
```

**Key Decisions:**
- **Pre-set amounts:** Reduces cognitive load during crisis
- **Balance shown:** Prevents overdraft, builds awareness
- **Optional message:** Human touch without forcing it
- **Delayed confirmation:** Honest about offline reality

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
│     2024-12-24 09:15 ⏳         │  ← Pending confirmation
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

**Key Decisions:**
- **Green (sent) vs. Yellow (received):** Quick visual scan
- **Checkmark vs. Hourglass:** Confirmation status clear
- **System transactions visible:** Transparency
- **30-day window:** Prevents information overload

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
│  > Byt profilbild               │
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
│  Offline-läge                   │
│  [✓] Bluetooth mesh aktivt      │
│  [✓] Spara data vid låg batterinivå│
│  [ ] Endast WiFi-synk           │
│                                 │
│  FRG-medlemskap                 │
│  [ ] Jag är FRG-medlem          │  ← Unlocks group features
│  > Gå med i lokal FRG-grupp     │
│                                 │
│  Språk                          │
│  ● Svenska  ○ English           │
│                                 │
│  Om Stuga                       │
│  > Användarvillkor              │
│  > Integritetspolicy            │
│  > Kontakta support             │
│  > Version 1.0.0                │
│                                 │
│  [Logga ut]                     │
└─────────────────────────────────┘
```

**Key Decisions:**
- **Privacy defaults:** Conservative (exact location off)
- **FRG toggle:** Unlocks group coordination features
- **Offline controls:** Users can manage battery
- **Language toggle:** Swedish default, English available

---

## Additional UI Components

### Offline Indicator (Persistent)

**Always visible top-right:**

```
🔌 Offline  (red)   ← No internet, Bluetooth only
📡 Mesh     (yellow) ← Mesh network active
🌐 Online   (green)  ← Internet connection
```

**Tap indicator →**
```
┌─────────────────────────────────┐
│  Nätverksstatus                 │
├─────────────────────────────────┤
│  🔌 OFFLINE-LÄGE                │
│                                 │
│  Senast online: 2 tim sedan     │
│  Bluetooth-mesh: Aktiv          │
│  Grannar nåbara: 3              │
│  Pending synk: 2 transaktioner  │
│                                 │
│  Stuga fungerar fullt ut i      │
│  offline-läge. Din data         │
│  synkroniseras automatiskt      │
│  när internet återvänder.       │
│                                 │
│  [Klar]                         │
└─────────────────────────────────┘
```

### Mesh Network Visualization

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

### Hearts Balance Widget (Home Screen)

**Prominent display:**
```
┌───────────────────────────────┐
│  💖 DINA HEARTS               │
│  ════════════════════         │
│                               │
│     180 Hearts                │
│                               │
│  +25 (denna vecka)            │
│  -75 (denna vecka)            │
│                               │
│  [Se historik →]              │
└───────────────────────────────┘
```

---

## Onboarding Flow (First-Time Users)

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
│  📡 Bluetooth                   │
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

## Accessibility Features

### Screen Reader Support

All elements have descriptive labels:
```typescript
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Skicka 50 Hearts till Anna Svensson"
  accessibilityHint="Bekräfta transaktion genom att dubbelklicka"
>
  <Text>Skicka 50 Hearts</Text>
</TouchableOpacity>
```

### High Contrast Mode

Settings toggle: "Hög kontrast"

- Increases contrast to 7:1
- Thicker borders
- Larger tap targets (48x48pt minimum)

### Font Scaling

Respects system font size settings:
- Minimum: 16px body text
- Maximum: 24px (prevents layout breaks)

### Color Blindness

No information conveyed by color alone:
- Green dot + "Nära" text
- Red dot + "Via mesh" text
- Icons supplement all colors

---

## Performance & Battery

### Battery-Saving Mode

**Auto-enabled at <20% battery:**
- Reduce Bluetooth scan frequency (60s → 300s)
- Disable background sync
- Reduce UI animations
- Monochrome mode (saves OLED power)

**User notification:**
```
⚠️ Batterisparläge aktiverat

Bluetooth-skanning reducerad.
Din plats uppdateras var 5:e minut.
```

### Data Usage (Offline-First)

**Typical 72-hour crisis scenario:**

| Activity | Data Used |
|----------|-----------|
| 100 resource posts | ~50 KB |
| 50 Hearts transactions | ~25 KB |
| Mesh gossip (local) | 0 bytes (Bluetooth) |
| **Total:** | **<100 KB** |

**Compare to WhatsApp:** 10-20 MB for similar activity

---

## Future Features (Not MVP)

### Phase 2 (Months 4-6)

- [ ] In-app messaging (simple, Signal-style encryption)
- [ ] Resource photos (1 photo per resource)
- [ ] Voice notes (for elderly)
- [ ] Group coordination (FRG-specific)

### Phase 3 (Months 7-12)

- [ ] Offline maps (cached OpenStreetMap)
- [ ] Resource history/archive
- [ ] Hearts leaderboard ("Top Contributors")
- [ ] Multi-language (Arabic, Somali for Swedish immigrant communities)

---

## Design Assets Needed

**Before development:**

1. **App icon** (1024x1024)
   - Stuga cottage silhouette
   - Forest green + warm orange
   - Simple, recognizable at small size

2. **Category icons** (SVG)
   - Mat 🥔, Värme 🔥, Verktyg 🔨, etc.
   - Line art style, 2px stroke
   - Forest green color

3. **Splash screen**
   - Stuga logo + "Grannskap som fungerar"
   - 3 seconds max

4. **Empty states**
   - "Inga grannar i närheten än"
   - "Inga resurser tillagda"
   - "Ingen Hearts-historik"

5. **Illustrations**
   - Onboarding screens (simple, Swedish aesthetic)
   - Offline explanation diagram
   - Mesh network visualization

---

## Platform-Specific Notes

### iOS

- Use SF Symbols for system icons
- Follow iOS Human Interface Guidelines
- SwiftUI for native feel (if budget allows)

### Android

- Material Design 3 components
- Adaptive icons
- Respect system gestures

---

## Success Criteria

**UI is successful if:**

✅ 70-year-old can post a resource in <3 taps  
✅ Works on 5-year-old phone with cracked screen  
✅ Clear offline status at all times  
✅ No confusion about Hearts value (SEK vs. Hearts)  
✅ Passes government accessibility audit  
✅ <5% user error rate in pilot  
✅ Battery lasts 72+ hours with active use  

---

**END OF UI SPECIFICATION**

*Designed for crisis, optimized for offline, accessible for all ages. Every screen must answer: "Does this help neighbors coordinate when the internet is down?"*

*Next steps: Interactive prototypes (Figma), user testing with Väsby pilot group, iOS/Android implementation.*
