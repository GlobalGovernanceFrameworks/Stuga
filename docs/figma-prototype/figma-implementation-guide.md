# Stuga Figma Prototype - Implementation Guide
## Bygg en klickbar prototyp på 1-2 dagar

**Mål:** Interaktiv demo för möten med Väsby kommun & Civilförsvarsförbundet  
**Verktyg:** Figma (gratis account räcker)  
**Tid:** 8-12 timmar  
**Resultat:** Klickbar prototyp som visar alla huvudflöden  

---

## Design System Setup

### Färgpalett

```
Skapa dessa färger som "Styles" i Figma:

PRIMARY COLORS:
Forest Green: #2D5016
Warm Orange: #FF6B35

FEEDBACK COLORS:
Success Green: #6BCF7F
Warning Amber: #FFA500
Danger Red: #C1121F

NEUTRALS:
Background: #F5F3F0
Text Dark: #1A1A1A
Text Medium: #666666
Text Light: #999999
Border: #E0E0E0

STATUS COLORS:
Online Green: #4CAF50
Mesh Yellow: #FFB300
Offline Red: #F44336

MESH DOTS:
Direct Blue: #2196F3
Via Mesh Gray: #BDBDBD
```

### Typografi

```
Skapa dessa text styles:

H1 - Header Large
Font: SF Pro Display / Roboto
Size: 24px
Weight: Bold
Color: #1A1A1A

H2 - Header Medium  
Font: SF Pro Display / Roboto
Size: 20px
Weight: Semibold
Color: #1A1A1A

Body - Regular
Font: SF Pro Text / Roboto
Size: 16px
Weight: Regular
Color: #1A1A1A
Line height: 24px

Body Small
Font: SF Pro Text / Roboto
Size: 14px
Weight: Regular
Color: #666666

Button Text
Font: SF Pro Text / Roboto
Size: 18px
Weight: Semibold
Color: #FFFFFF
```

### Grid & Spacing

```
Mobile Canvas: 375x812 (iPhone X size)
Margins: 16px left/right
Component spacing: 8px, 16px, 24px (use multiples of 8)
Touch targets: Minimum 44x44px
```

---

## Component Library

**Skapa dessa återanvändbara komponenter:**

### 1. Status Indicator (Top Bar)

**Variant 1 - Online:**
```
🌐 Online
Background: #4CAF50
Text: White, 14px
Padding: 4px 12px
Border radius: 12px
```

**Variant 2 - Mesh:**
```
📡 Mesh
Background: #FFB300
Text: White, 14px
Padding: 4px 12px
Border radius: 12px
```

**Variant 3 - Offline:**
```
📌 Offline
Background: #F44336
Text: White, 14px
Padding: 4px 12px
Border radius: 12px
```

### 2. Neighbor Card

```
Card Container:
- Width: 343px (375 - 32px margins)
- Height: Auto
- Background: #FFFFFF
- Border radius: 12px
- Padding: 16px
- Drop shadow: 0px 2px 8px rgba(0,0,0,0.08)

Content:
┌─────────────────────────────┐
│ 🟢 Anna Svensson    50m ↗️  │  ← Status dot + name + distance
│ Erbjuder: Ved, Generator    │  ← Resources text
│ 💗 245 Hearts               │  ← Hearts count
└─────────────────────────────┘

Status Dot:
- Green #4CAF50: Direct (0 hops)
- Yellow #FFB300: 1 hop
- Red #F44336: 2+ hops
- Size: 12x12px circle

Name:
- Font: Semibold 16px
- Color: #1A1A1A

Distance:
- Font: Regular 14px
- Color: #666666

Resources:
- Font: Regular 14px
- Color: #666666

Hearts:
- Font: Regular 14px
- Color: #FF6B35
```

### 3. Primary Button

```
Default state:
- Background: #2D5016 (Forest Green)
- Text: White, Semibold 18px
- Height: 56px
- Width: Full width (343px)
- Border radius: 12px
- No border

Hover state:
- Background: #3D6020 (lighter)

Pressed state:
- Background: #1D3010 (darker)
- Scale: 98%
```

### 4. Secondary Button

```
Default state:
- Background: Transparent
- Text: #2D5016, Semibold 18px
- Border: 2px solid #2D5016
- Height: 56px
- Border radius: 12px
```

### 5. Resource Category Button

```
Icon button (for "Lägg till resurs" screen)

Default:
- Size: 80x80px
- Background: #F5F3F0
- Border: 2px solid #E0E0E0
- Border radius: 12px
- Icon: 32x32px centered
- Label: 12px below icon

Selected:
- Background: #E1F5DD (light green)
- Border: 2px solid #2D5016
```

### 6. Hearts Balance Widget

```
Container:
- Width: 343px
- Height: 120px
- Background: Linear gradient (#2D5016 to #3D6020)
- Border radius: 16px
- Padding: 20px

Content:
💖 DINA HEARTS
───────────────────

    180 Hearts

+25 (denna vecka)
-75 (denna vecka)

[Se historik →]
```

### 7. Input Field

```
Default state:
- Width: Full (343px)
- Height: 48px
- Background: #FFFFFF
- Border: 1px solid #E0E0E0
- Border radius: 8px
- Padding: 12px 16px
- Placeholder: #999999

Focused state:
- Border: 2px solid #2D5016

Error state:
- Border: 2px solid #C1121F
```

### 8. Mesh Status Bar

```
Bottom of home screen:

🔵🔵🔵⚪️⚪️ 3/5 noder nåbara

Filled dots (#2196F3): Connected nodes
Empty dots (#E0E0E0): Total possible nodes
Text: 14px, #666666
```

---

## Screen Specifications

### Screen 1: Grannkarta (Home)

**Frame: 375x812px**

**Top Bar (fixed):**
```
┌─────────────────────────────┐
│ ☰ Stuga      📌 Offline   │ ← 16px from top
└─────────────────────────────┘
Height: 56px
Background: #FFFFFF
Border bottom: 1px solid #E0E0E0
```

**Content Area:**
```
Scroll container starting 72px from top

Header:
🏘 GRANNAR (12 INOM 500M)
Font: H2, 20px Semibold
Margin: 24px top, 16px bottom

Neighbor Cards:
- Stack vertically
- 16px spacing between cards
- Use Neighbor Card component (4 variants)

Card 1: Anna Svensson (Green, 50m ↗️)
Card 2: Sven Andersson (Green, 120m ↙️)
Card 3: Maria Johansson (Yellow, 350m ↖️)
Card 4: Erik Nilsson (Red, 480m ↘️)
```

**Action Buttons (sticky bottom):**
```
Container height: 140px
Background: #FFFFFF
Border top: 1px solid #E0E0E0
Padding: 16px

[➕ Lägg till resurs] ← Primary button
[💖 Skicka Hearts]    ← Secondary button

Spacing: 12px between buttons
```

**Mesh Status (above buttons):**
```
Senast synkad: 2 tim sedan
🔵🔵🔵⚪️⚪️ (3 noder nåbara)

Font: 14px Regular
Color: #666666
Centered
Margin: 8px bottom
```

### Screen 2: Resurs detaljvy

**Top Bar:**
```
┌─────────────────────────────┐
│ ← Tillbaka               │
└─────────────────────────────┘
Left arrow: Tap to return to home
```

**Profile Section:**
```
Centered, 24px from top:

[Profile Photo]          ← 80x80px circle, placeholder image
Anna Svensson       🟢   ← Name + status dot
120m norr · 💗 245 Hearts ← Distance + Hearts

Profile photo:
- 80x80px circle
- Border: 3px solid #2D5016
- Placeholder: Initials "AS" on #E1F5DD background

Spacing: 16px between photo and name
```

**Resources Section:**
```
24px margin top:

Divider line (1px, #E0E0E0)

ERBJUDER               ← 16px Semibold, #1A1A1A
                         16px top margin

Resource cards (white background):
┌─────────────────────────────┐
│ 🪵 Ved, ca 0.5 m³           │
│ "Såg träd förra veckan,      │
│  kan dela med 2-3 familjer" │
└─────────────────────────────┘

Icon: 24x24px
Title: 16px Semibold
Description: 14px Regular, #666666
Padding: 16px
Border radius: 8px
Border: 1px solid #E0E0E0
Margin: 12px between cards
```

**Action Buttons (bottom):**
```
[💬 Kontakta Anna]      ← Primary button
[💖 Skicka Hearts (tack)] ← Secondary button

Padding: 16px
Background: #FFFFFF
Border top: 1px solid #E0E0E0
```

### Screen 3: Lägg till resurs

**Top Bar:**
```
← Avbryt              Spara
Left: Tap to cancel (goes back)
Right: Tap to save (disabled until form valid)

Divider: 1px solid #E0E0E0
```

**Form Section:**
```
24px from top:

Toggle (Jag...):
◯ Erbjuder   ● Behöver

Toggle styling:
- Height: 48px
- Selected: #2D5016 fill
- Unselected: Border only
- Border radius: 24px

16px margin

Kategori
────────────────────
Grid: 2 columns x 4 rows
Gap: 12px

Use Resource Category Button component:
[Mat 🥖]  [Värme 🔥]
[Verktyg 🔨] [Transport🚗]
[Kunskap 📚] [Boende 🏠]
[Första hjälpen ⚕️] [Annat]

16px margin

Beskrivning
Input field (multiline):
- Height: 120px
- Max: 200 characters
- Counter: "25/200" bottom right
- Placeholder: "Beskriv resursen..."

16px margin

Privacy checkboxes:
[ ] Synlig för alla grannar
[✓] Synlig för FRG-medlemmar
[ ] Endast nära grannar (<100m)

Checkbox: 20x20px
Border: 2px solid #2D5016
Checked: Green checkmark
Label: 14px Regular
```

### Screen 4: Skicka Hearts

**Top Bar:**
```
← Avbryt
```

**Content (centered):**
```
24px from top:

Skicka Hearts till:

[Profile Photo] ← 60x60px circle
Anna Svensson
💗 Hennes saldo: 245 Hearts

24px margin

Hur mycket?
────────────────────
Quick select grid (2x2):

[⭕️ 25]  [⭕️ 50]
[⭕️ 100] [⭕️ Annat: ___]

Button size: 80x80px
Border: 2px solid #E0E0E0
Selected: #2D5016 fill, white text
Gap: 12px

16px margin

Varför? (valfritt)
Input field:
- Height: 80px
- Placeholder: "T.ex. 'Tack för veden!'"

16px margin

Balance display:
💗 Ditt saldo: 180 Hearts
(blir 130 efter detta)

Font: 14px Regular
Color: #666666
Light background: #F5F3F0
Padding: 12px
Border radius: 8px

24px margin

[Skicka 50 Hearts] ← Primary button
```

**Success State (after sending):**
```
Centered content:

✓ ← Large checkmark (64x64px, #6BCF7F)

Skickat till Anna!

💖 50 Hearts
"Tack för veden!"

Bekräftelse kommer när Anna
är online eller inom Bluetooth-
räckvidd.

[Klar] ← Primary button
```

### Screen 5: Hearts historik

**Top Bar:**
```
← Tillbaka
```

**Balance Widget (top):**
```
Use Hearts Balance Widget component
Margin: 16px
```

**History Section:**
```
Senaste 30 dagarna ← 14px Semibold, centered
─────────────────

SKICKAT ← 16px Semibold, #2D5016

Transaction cards:
┌─────────────────────────────┐
│ 💚 Anna Svensson            │
│    -50 Hearts               │
│    "Tack för veden!"        │
│    2024-12-25 14:30 ✓       │
└─────────────────────────────┘

Card styling:
- Background: #FFFFFF
- Border: 1px solid #E0E0E0
- Border radius: 8px
- Padding: 12px
- Margin: 8px bottom

Icons:
💚 = Sent (green heart)
💛 = Received (yellow heart)
✓ = Confirmed (green check)
⏳ = Pending (hourglass)

16px margin between sections

MOTTAGIT ← 16px Semibold, #FF6B35

[Same card format for received transactions]
```

### Screen 6: Inställningar

**Top Bar:**
```
← Tillbaka
```

**Settings List:**
```
Grouped sections with dividers:

INSTÄLLNINGAR ← 24px Semibold, 16px top margin

Section divider: 1px solid #E0E0E0, 8px margins

Profil
> Min profil        ← Chevron right
> Byt profilbild

Synlighet
[✓] Synlig för grannar
[✓] Dela ungefärlig plats
[ ] Dela exakt plats

Notifikationer
[✓] Hearts mottagna
[✓] Nya resurser i närheten
[ ] Daglig sammanfattning

Offline-läge
[✓] Bluetooth mesh aktivt
[✓] Spara data vid låg batterinivå
[ ] Endast WiFi-synk

FRG-medlemskap
[ ] Jag är FRG-medlem
> Gå med i lokal FRG-grupp

Språk
● Svenska  ◯ English

Om Stuga
> Användarvillkor
> Integritetspolicy
> Kontakta support
> Version 1.0.0

[Logga ut] ← Danger button (red text)

List item styling:
- Height: 48px
- Padding: 12px 16px
- Tap highlight: #F5F3F0
- Divider: 1px solid #E0E0E0
```

---

## Onboarding Screens

### Onboarding 1: Welcome

**Centered content:**
```
[Large cottage emoji: 🏘️]
Size: 80x80px
Margin: 80px from top

Välkommen till Stuga
Font: H1, 24px Bold
Margin: 24px top

Samordna resurser med dina
grannar under kriser - även
när internet ligger nere.

Font: Body, 16px Regular
Color: #666666
Max width: 280px
Centered text
Line height: 24px

40px margin

[Kom igång →] ← Primary button
[Läs mer]      ← Secondary button
```

### Onboarding 2: BankID

```
Verifiera med BankID ← H1

För att förhindra missbruk
kräver Stuga BankID-
verifiering.

Din identitet delas INTE med
grannar - bara ditt namn.

[Öppna BankID →] ← Primary button

Button should show BankID icon
```

### Onboarding 3: Permissions

```
Tillåt plats & Bluetooth ← H1

📍 Plats
För att visa grannar i
närheten (avrundad till 50m).

📡 Bluetooth
För offline mesh-nätverk när
internet ligger nere.

[Tillåt & fortsätt →] ← Primary button
```

### Onboarding 4: Add Resource

```
Lägg till en resurs ← H1

Börja med att dela något du
kan erbjuda ELLER något du
skulle kunna behöva.

[+ Lägg till resurs] ← Primary button
[Hoppa över för nu]  ← Secondary button

💡 Tips: Även små saker
(en trädgårdsspade, hjälp med
snöskottning) är värdefulla
för grannar under kris.

Font: 14px Regular
Color: #666666
Background: #F5F3F0
Padding: 16px
Border radius: 8px
```

### Onboarding 5: Welcome Hearts

```
[Party emoji: 🎉]
Size: 64x64px
Margin: 80px from top

Du har fått 100 Hearts!

Hearts är Stugas sätt att
spåra ömsesidig hjälp.
Använd dem för att tacka
grannar som hjälper dig.

[Börja utforska →] ← Primary button
```

---

## Interactive Flows (Prototyping)

**Setup interactions in Figma:**

### Flow 1: Browse Neighbors → View Details
```
Home Screen:
- Tap on "Anna Svensson" card
  → Navigate to: Resurs detaljvy (Anna)
  
Resurs detaljvy:
- Tap "← Tillbaka"
  → Navigate to: Home Screen
```

### Flow 2: Send Hearts
```
Home Screen:
- Tap "💖 Skicka Hearts" button
  → Navigate to: Skicka Hearts screen

Skicka Hearts:
- Tap "Anna Svensson" (auto-filled from previous selection)
- Tap "50" quick select
- (Optional) Type message
- Tap "Skicka 50 Hearts"
  → Navigate to: Success state

Success state:
- Tap "Klar"
  → Navigate to: Home Screen
```

### Flow 3: Add Resource
```
Home Screen:
- Tap "➕ Lägg till resurs"
  → Navigate to: Lägg till resurs screen

Lägg till resurs:
- Toggle "Behöver"
- Tap "Värme 🔥" category
- Type description
- Tap "Spara"
  → Navigate to: Home Screen (now with new resource)
```

### Flow 4: Onboarding
```
Welcome screen:
- Tap "Kom igång →"
  → Navigate to: BankID screen

BankID screen:
- Tap "Öppna BankID →"
  → Navigate to: Permissions screen

Permissions screen:
- Tap "Tillåt & fortsätt →"
  → Navigate to: Add Resource screen

Add Resource screen:
- Tap "Hoppa över för nu"
  → Navigate to: Welcome Hearts screen

Welcome Hearts:
- Tap "Börja utforska →"
  → Navigate to: Home Screen
```

### Flow 5: View Settings
```
Home Screen:
- Tap "☰" menu icon
  → Navigate to: Inställningar screen

Inställningar:
- Tap "← Tillbaka"
  → Navigate to: Home Screen
```

### Flow 6: View Hearts History
```
Home Screen:
- Tap Hearts Balance Widget "Se historik →"
  → Navigate to: Hearts historik

Hearts historik:
- Tap "← Tillbaka"
  → Navigate to: Home Screen
```

---

## Assets Needed

**Before starting, gather/create these:**

### Icons (use Figma plugins or download)

**Find these icons (24x24px, line style):**
- Cottage/House (☰ replacement)
- Signal strength (📡)
- Pin/Location (📌)
- Plus (+)
- Heart (💖)
- Arrow directions (↗️ ↙️ ↖️ ↘️)
- Checkmark (✓)
- Hourglass (⏳)
- Close/X
- Back arrow (<)
- Chevron right (>)

**Category icons (32x32px):**
- Mat: Bread 🥖
- Värme: Fire 🔥
- Verktyg: Hammer 🔨
- Transport: Car 🚗
- Kunskap: Books 📚
- Boende: House 🏠
- Första hjälpen: Medical ⚕️
- Annat: Circle

**Plugins to use:**
- "Iconify" (free, millions of icons)
- "Material Design Icons"
- "Feather Icons"

### Images

**Profile photos (placeholders):**
- 5-6 circular placeholder avatars
- Use initials on colored background
- Colors: #E1F5DD, #FFE6CC, #FFE6E6, #E6F3FF
- Font: 24px Bold, centered

**Can generate via:**
- UI Faces (free placeholders)
- Figma "Content Reel" plugin
- Or just use initials

### Illustrations

**Welcome screen cottage:**
- Simple line drawing of Swedish cottage
- Or use emoji 🏘️ sized to 80x80px

**Mesh visualization (optional):**
- Simple node diagram
- Circles connected by lines
- Can draw directly in Figma

---

## Build Order (Recommended)

**Day 1 (4-6 hours):**

1. **Setup (30 min)**
   - Create new Figma file: "Stuga Prototype"
   - Set up design system (colors, text styles)
   - Create mobile frame: 375x812

2. **Components (2 hours)**
   - Status indicator (3 variants)
   - Neighbor card
   - Primary/secondary buttons
   - Input fields
   - Resource category buttons

3. **Core screens (2 hours)**
   - Home screen (grannkarta)
   - Resurs detaljvy
   - Lägg till resurs

4. **Test interactions (30 min)**
   - Link screens together
   - Test basic flows

**Day 2 (4-6 hours):**

5. **Hearts screens (2 hours)**
   - Skicka Hearts
   - Hearts historik
   - Success states

6. **Settings & Onboarding (2 hours)**
   - Inställningar screen
   - 5 onboarding screens

7. **Polish (1 hour)**
   - Add all interactions
   - Test all flows
   - Fix spacing issues
   - Add transition animations

8. **Present mode setup (30 min)**
   - Set starting frame
   - Test full prototype
   - Share link

---

## Prototype Settings

**In Figma Prototype panel:**

```
Device: iPhone 13/14
Starting frame: Welcome screen (or Home if skipping onboarding)

Interaction defaults:
- Trigger: On Tap
- Action: Navigate to
- Animation: Instant (or Push from right if you prefer)
- Easing: Ease Out
- Duration: 300ms

For buttons:
- Add hover state (optional)
- Add pressed state (scale to 98%)
```

---

## Sharing the Prototype

**Export options:**

1. **Figma link (best for meetings):**
   - Click "Share" → "Get link"
   - Set to "Anyone with link can view"
   - Present mode URL
   - Works on desktop & mobile

2. **Embed in webpage:**
   - Get embed code
   - Add to GitHub Pages or similar

3. **Video recording:**
   - Use Figma's prototype recording
   - Upload to YouTube/Vimeo
   - Include in emails

---

## Demo Script (for meetings)

**When showing prototype to Väsby/Civilförsvarsförbundet:**

1. **Start at Welcome screen:**
   - "Här börjar alla nya användare"
   - Click through onboarding quickly
   - "BankID förhindrar falska konton"

2. **Home screen:**
   - "Anna ser sina grannar inom 500m"
   - "Gröna prickar = direktkontakt via Bluetooth"
   - "Gula/röda = via mesh-nätverk"
   - Point to mesh status: "System fungerar offline"

3. **View neighbor:**
   - Click on Anna
   - "Här ser man vad grannar erbjuder"
   - "Kan kontakta eller skicka Hearts direkt"

4. **Send Hearts:**
   - Click "Skicka Hearts"
   - Select 50
   - Add message
   - "Så enkelt att tacka grannar för hjälp"

5. **Add resource:**
   - Go back to home
   - Click "Lägg till resurs"
   - Select "Behöver" → "Värme"
   - "Vem som helst kan posta behov/erbjudanden"

6. **Show offline awareness:**
   - Point to top status: "Offline"
   - Point to mesh bar: "3 noder nåbara"
   - "Allt fungerar utan internet"

**Total demo: 5-7 minutes**

---

## Quality Checklist

**Before sharing, verify:**

- [ ] All text is Swedish (no English UI elements)
- [ ] Colors match spec (#2D5016, etc.)
- [ ] Font sizes: 16px minimum (accessibility)
- [ ] Touch targets: 44x44px minimum
- [ ] All screens are 375x812px
- [ ] Status indicator always visible
- [ ] Back navigation works everywhere
- [ ] Buttons have hover/pressed states
- [ ] All interactions are clickable
- [ ] Starting frame is set
- [ ] Link sharing is enabled
- [ ] Tested on mobile device

---

## Tips for Fast Building

**Speed hacks:**

1. **Use Auto Layout everywhere**
   - Makes spacing consistent
   - Easy to resize later

2. **Copy/paste screens for variations**
   - Duplicate Home screen → change to Offline variant
   - Duplicate buttons → change text/color

3. **Use components aggressively**
   - One neighbor card component with variants
   - Buttons as components
   - Status indicators as components

4. **Don't pixel-perfect everything**
   - This is a prototype, not production
   - Focus on flows over polish
   - 80% visual quality is fine

5. **Keyboard shortcuts:**
   - Cmd+D: Duplicate
   - Cmd+G: Group
   - Cmd+Opt+G: Frame
   - R: Rectangle
   - T: Text

---

## What NOT to Prototype

**Skip these for MVP demo:**

- Animations between screens (use Instant)
- Complex gesture interactions
- Loading states (assume instant)
- Error states (assume success)
- Empty states
- Edge cases

**Focus on happy path only.**

---

## After Building

**Next steps with prototype:**

1. **Self-test (15 min):**
   - Go through all flows
   - Fix broken links
   - Check Swedish text

2. **Friend test (30 min):**
   - Give link to friend
   - Ask: "Can you add a resource?"
   - Note confusion points
   - Quick fixes

3. **Prepare for meetings:**
   - Bookmark prototype URL
   - Test on laptop + phone
   - Practice 5-minute demo
   - Screenshot key screens for backup

4. **Send in advance (optional):**
   - Include link in meeting invite
   - "Here's a preview of the concept"
   - Allows stakeholders to explore

---

## Bottom Line

**You're building this to:**
- ✅ Show Väsby/Civilförsvarsförbundet concrete UI
- ✅ Get feedback before coding
- ✅ Validate concept makes sense
- ✅ Look professional in meetings

**Not to:**
- ❌ Create production-ready designs
- ❌ Include every feature
- ❌ Waste time on edge cases

**Build the 6 core screens + onboarding. Link them together. Ship it.**

8-12 hours max. Go! 🎯
