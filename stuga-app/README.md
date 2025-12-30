# Stuga MVP - React Native App

Detta är Stuga MVP-implementationen med React Native + Firebase.

**Status:** Aktiv utveckling (Vecka 3/10)  
**Plattform:** iOS + Android via Expo  
**Backend:** Firebase (Stockholm-region)

## Snabbstart

### Krav
- Node.js 20+
- npm eller yarn
- Expo Go-appen (för testning på telefon)

### Installation
```bash
# Klona repo
git clone https://github.com/GlobalGovernanceFrameworks/Stuga.git
cd Stuga/stuga-app

# Installera beroenden
npm install

# Starta utvecklingsserver
npx expo start
```

Scanna QR-koden med Expo Go-appen (Android) eller kamera-appen (iOS).

### Firebase-konfiguration

Skapa `src/config/firebase.ts` med dina Firebase-uppgifter:
```typescript
const firebaseConfig = {
  apiKey: "DIN_API_KEY",
  authDomain: "stuga-pilot.firebaseapp.com",
  projectId: "stuga-pilot",
  // ... etc
};

# Om appen inte laddar
npx expo start --tunnel

```


## Projektstruktur
```
src/
├── config/         # Firebase och övrig konfiguration
├── screens/        # Huvudskärmar (Home, NeighborDetail, AddResource)
├── navigation/     # React Navigation setup
├── types/          # TypeScript-typer
└── scripts/        # Verktyg (seedTestData.ts)
```

## Utveckling

### Testdata

Lägg till testdata i Firestore:
```bash
npx ts-node src/scripts/seedTestData.ts
```

### Körande funktioner

- ✅ Grannkarta (visa användare från Firestore)
- ✅ Granndetaljer (visa resurser per granne)
- ✅ Lägg till resurs (erbjudanden/behov)
- ⏳ Hearts-transaktioner (kommande)
- ⏳ Offline-stöd (kommande)

## Teknisk stack

- **Framework:** React Native (Expo)
- **UI:** React Native Paper (Material Design)
- **Navigation:** React Navigation 6
- **Backend:** Firebase Firestore
- **Auth:** Firebase Authentication (Anonymous för MVP)
- **Språk:** TypeScript

## Dokumentation

Se [docs/](../docs/) för:
- `Stuga-MVP-Implementation-Guide.md` - Veckoplan (10 veckor)
- `TECHNICAL_SPECIFICATION.md` - Arkitektur
- `UI_SPECIFICATION.md` - Designsystem

## Bidra

Detta är ett öppet forskningsprojekt (AGPL-3.0). Se [rot-README](../README.md) för bidragsinformation.

**Kontakt:** bjorn.kenneth.holmstrom@gmail.com

## Licens

AGPL-3.0 - Se [LICENSE](../LICENSE)
