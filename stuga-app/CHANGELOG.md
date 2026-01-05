# Changelog

Alla viktiga ändringar i Stuga MVP dokumenteras här.

Formatet baseras på [Keep a Changelog](https://keepachangelog.com/sv-SE/1.0.0/).

## [Unreleased]

### Planerat
- BankID-integration för produktionsanvändare
- Bluetooth mesh networking för närhetskommunikation
- Push-notifikationer via FCM

## [0.5.0] - 2025-01-05

### Tillagt
- **Offline-stöd med SQLite**: Köa transaktioner när internet saknas
  - SQLite-databas för lokal lagring av väntande transaktioner
  - Automatisk initialisering av databas vid appstart
  - Queuing-system för Hearts-transaktioner när offline
  - **Queuing-system för resurser**: Skapa och ta bort resurser offline
  - Transaktioner och resurser sparas lokalt och skickas när anslutning återvänder
  
- **Nätverksdetektering**: Realtidsövervakning av internetanslutning
  - useNetworkState hook med @react-native-community/netinfo
  - Visar offline-indikator i header (📡 Offline) på alla skärmar
  - Offline-kort på HomeScreen visar antal väntande transaktioner
  - **Offline-kort på AddResourceScreen och RemoveResourceScreen**
  - SendHeartsScreen visar orange varning när offline
  
- **Automatisk synkronisering**: Skickar köade transaktioner och resurser när online
  - useOfflineSync hook hanterar sync-logik
  - Detekterar när anslutning återkommer
  - Synkroniserar automatiskt alla väntande transaktioner
  - **Synkroniserar automatiskt skapande och borttagning av resurser**
  - Visar synkroniseringsstatus med grön indikator
  - Uppdaterar väntande antal efter lyckad sync
  
- **Manuell synkronisering**: Synka-knapp för användarinitierad sync
  - "Synka (N)"-knapp visas när väntande transaktioner/resurser finns
  - Visar antal väntande operationer (Hearts + resurser)
  - Inaktiverad när offline eller redan synkar
  - Loading-indikator under pågående synkronisering
  - useFocusEffect uppdaterar antal när man navigerar tillbaka
  
- **Förbättrad offline-upplevelse**:
  - Tydliga meddelanden när transaktioner/resurser köas
  - **"📦 Offline: Resursen köad!" vid resursskapande**
  - **"📦 Offline: Borttagning köad!" vid resursborttagning**
  - Visual feedback för offline-läge på alla relevanta skärmar
  - Konsollloggar för debugging (✅ synced, 💾 queued, 🔄 syncing)
  - Städfunktion för gamla synkade transaktioner (7 dagar)

### Förbättrat
- **Navigation header**: Persistent offline-indikator i alla vyer
- **HomeScreen**: Hearts och Synka-knappar i eget rad över FAB-knappar
- **SendHeartsScreen**: Orange offline-kort varnar innan man skickar
- **AddResourceScreen**: Safe area padding för scrollning, spara-knapp alltid synlig
- **RemoveResourceScreen**: Safe area padding för scrollning, ta bort-knappar alltid synliga

### Tekniskt
- expo-sqlite för lokal databas
- @react-native-community/netinfo för nätverksdetektering
- pending_transactions tabell (id, type, data, created_at, synced)
- **Tre transaktionstyper**: hearts_transaction, resource_create, resource_delete
- Database helpers: 
  - queueHeartsTransaction, queueResourceCreate, queueResourceDelete
  - syncPendingTransactions (hanterar alla tre typer)
  - getPendingCount, markTransactionSynced, cleanupSyncedTransactions
- Hooks: useNetworkState, useOfflineSync
- Auto-cleanup av synkade transaktioner (>7 dagar)
- HeaderRight komponent i AppNavigator
- useSafeAreaInsets för korrekt scrollning i alla formulär

## [0.4.1] - 2025-01-02

### Utveckling/Testing
- **Email/lösenord testanvändare**: Möjliggör konsistent testanvändare på flera enheter
  - Anonymous auth skapar olika UID per enhet
  - Email/lösenord (`test@stuga.local`) ger samma användare överallt
  - Automatisk fallback: Försöker email först, sedan anonymous
  - Gör demonstrationer enklare på olika datorer/telefoner
  - Användbara för pilotutveckling och demos

### Buggfixar
- **HeartsHistoryScreen scroll-problem**: Kan nu scrolla hela vägen ner
  - "Bekräfta mottagning"-knapp hamnade bakom navigationsknappar
  - Lagt till SafeAreaInsets padding (bottom + 80px)
  - Kan nu bekräfta transaktioner utan problem
- **Saknad import**: Lade till `doc` från Firestore
  - Åtgärdade "Property 'doc' doesn't exist"-fel vid bekräftelse

### Tekniskt
- Firebase Email/Password authentication aktiverad
- signInWithEmailAndPassword med fallback till anonymous
- Samma Hearts-saldo och transaktionshistorik på alla enheter
- useSafeAreaInsets i HeartsHistoryScreen för korrekt scrollning

## [0.4.0] - 2026-01-02

### Tillagt
- **Saldovalidering**: Förhindrar att skicka fler Hearts än man har
  - Klient-validering: Inaktiverad knapp och varningsmeddelande
  - Server-validering: Cloud Function kontrollerar saldo innan transaktion
  - Återställer transaktion om otillräckligt saldo vid bekräftelse
- **Förhindra dubbletter**: Kan inte skicka flera obekräftade transaktioner till samma person
  - Kontrollerar om väntande transaktion finns
  - Visar varning och inaktiverar skicka-knapp
  - Förhindrar oavsiktlig spam
- **Skeleton screens**: Professionella laddningsindikatorer
  - Platshållare-kort istället för enkla spinners
  - Visar förväntad layout medan data laddas
  - Implementerat i alla huvudskärmar (Home, NeighborDetail, HeartsHistory)
- **Statusmärken**: Visuella indikatorer för resursstatus
  - 🟢 Öppen (grön) - resurs tillgänglig
  - 🟡 Matchad (orange) - någon har tagit resursen
  - ⚪ Slutförd (grå) - utbyte genomfört
  - 🔴 Avbruten (röd) - resurs avbruten
  - Kategorilabels med emojis (Värme 🔥 istället för "värme")

### Förbättrat
- **Auto-uppdatering av data**:
  - Pull-to-refresh på HomeScreen (uppdatera grannlista)
  - Automatisk omladdning när skärmar kommer i fokus
  - Saldon alltid aktuella efter transaktioner
- **Kategorivisning**: Formaterade namn istället för rå databasvärden
  - Helper-funktioner för kategori-mappning
  - Konsekvent visning över alla skärmar

### Tekniskt
- SkeletonCard-komponent för återanvändning
- StatusBadge-komponent med färgkodning
- categoryHelpers för centraliserad kategori-mappning
- useFocusEffect hook för automatisk datareload
- RefreshControl på FlatList för pull-to-refresh

## [0.3.0] - 2025-12-31

### Tillagt
- **Cloud Functions**: Automatisk Hearts-balansuppdatering
  - Balans dras från avsändare när mottagare bekräftar
  - Balans läggs till för mottagare
  - Transaktion markeras som slutförd med tidsstämpel
  - Loggar i Firebase Functions för debugging
- **Bekräfta mottagning**: Knapp i Hearts Historik för att bekräfta mottagna Hearts
  - Triggar Cloud Function automatiskt
  - Uppdaterar bägge användares saldon
  - Visar bekräftelsestatus (✓ eller ⏳)

### Tekniskt
- Firebase Cloud Functions v2 med Firestore triggers
- onDocumentUpdated trigger för transaktionsbekräftelse
- Batch-operationer för atomiska uppdateringar
- Service account permissions konfigurerade

## [0.2.0] - 2025-12-30

### Tillagt
- **Hearts-transaktioner**: Skicka tack till grannar med Hearts
  - Snabbval (25, 50, 100 Hearts) eller anpassat belopp
  - Valfritt meddelande med varje transaktion
  - Visar ditt saldo och förhandsvisning
- **Hearts Historik**: Se alla skickade och mottagna transaktioner
  - Separata sektioner för skickat/mottagit
  - Visa vem, när, hur mycket, och status (bekräftat/väntande)
  - Nuvarande saldo överst
- **Ta bort resurser**: Radera egna erbjudanden/behov
  - Lista alla dina resurser
  - Bekräftelsedialog innan borttagning
- **Förbättrad UI**:
  - Sidobredd-knappar för Lägg till / Ta bort resurser
  - Bättre tomma tillstånd (när inga grannar/resurser finns)
  - Förhindra att skicka Hearts till dig själv
  - Bättre kontrast på knappar (vit text på mörk bakgrund)

### Tekniskt
- Firestore-frågor för transaktionshistorik med OR-filtrering
- Dynamisk namnuppslagning från user_id till namn
- Säker borttagning med bekräftelsedialog
- Förbättrad knapppositionering med SafeAreaInsets

## [0.1.0] - 2025-12-30

### Tillagt
- **Grannkarta**: Visa grannar inom närområdet med Hearts-saldo
- **Granndetaljer**: Se vad grannar erbjuder och behöver
- **Lägg till resurs**: Posta erbjudanden eller behov med 8 kategorier:
  - Mat 🥪, Värme 🔥, Verktyg 🔨, Transport 🚗
  - Kunskap 📚, Boende 🏠, Första hjälpen ⚕️, Annat
- Testdata för utveckling (3 användare, 4 resurser)

### Tekniskt
- React Native med Expo-ramverk
- Firebase Firestore (Stockholm-region för datalagringsplats)
- Säkerhetsregler för dataskydd
- Anonymous authentication för utveckling
- Material Design UI med React Native Paper

## [0.0.1] - 2025-12-29

### Tillagt
- Initial projektstruktur
- Firebase-projekt konfigurerat
- Grundläggande beroenden installerade
- Bundle ID: `org.globalgovernanceframeworks.stuga`

---

**Nästa milstolpe:** Saldovalidering, offline-kapabilitet (Vecka 4-5)
