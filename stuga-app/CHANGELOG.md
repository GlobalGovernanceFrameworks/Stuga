# Changelog

Alla viktiga ändringar i Stuga MVP dokumenteras här.

Formatet baseras på [Keep a Changelog](https://keepachangelog.com/sv-SE/1.0.0/).

## [Unreleased]

### Planerat
- Spela in demofilm för Upplands Väsby kommun (2 minuter)
- Testa Bluetooth-upptäckt med två enheter
- BankID-integration för produktionsanvändare
- Push-notifikationer via FCM
- Förbättrad platshistorik och tracking

## [0.7.0] - 2026-01-08

### Tillagt
- **Profilskärm**: Visa användarstatistik och historik
  - Visar Hearts-saldo, namn och medlemsdatum
  - Statistikrutnät: Hearts skickade/mottagna, resurser postade, grannar hjälpta
  - Senaste aktivitet: Visar 5 senaste transaktioner med tidsstämplar
  - Profilknapp (👤) i HomeScreen-headern
  - Utloggningsknapp
  - Pull-to-refresh för att uppdatera stats

- **Toast-notifikationer**: Snackbar för feedback
  - Använder React Native Paper's Snackbar-komponent
  - Icke-blockerande framgångsmeddelanden (✓ Resurs tillagd!, ✓ Hearts skickade!)
  - Offline-info meddelanden (📦 Köas för senare synk)
  - Auto-dismiss efter 3-5 sekunder beroende på meddelandetyp
  - Implementerat i AddResourceScreen, SendHeartsScreen, RemoveResourceScreen, HomeScreen
  - Bevarar alert() för valideringsfel och bekräftelsedialoger

- **Bluetooth mesh-nätverk (grundläggande)**: Förberedelser för offline-kommunikation
  - BluetoothMesh-klass med react-native-ble-plx
  - useBluetooth hook för Bluetooth-hantering
  - Närhetsdetektion via RSSI-signal
  - RSSI-till-avstånd konvertering för uppskattad räckvidd
  - UI-integration förberedd (kommenterad, väntar på testtelefon)
  - NOTERING: Kräver EAS development build (fungerar ej i Expo Go)
  - Suspenderad tills andra testtelefon finns tillgänglig

### Förbättrat
- **Alert vs Snackbar-strategi**: Konsekvent användarfeedback
  - Valideringsfel → alert() (blockerande, kräver åtgärd)
  - Bekräftelsedialoger → Alert.alert() med knappar
  - Framgångsmeddelanden → Snackbar (icke-blockerande)
  - Offline-info → Snackbar (informativ, ej blockerande)
  - Kritiska fel → alert() (blockerande)

- **Användarprofillogik**: Rättad "grannar hjälpta"-räkning
  - Tidigare: Räknade Hearts SKICKADE (fel - betyder "grannar jag tackat")
  - Nu: Räknar Hearts MOTTAGNA (korrekt - betyder "grannar jag hjälpt")
  - Logik: Om någon skickar mig Hearts = jag hjälpte dem

- **Användardokument-skapande**: Automatisk profil vid första inloggning
  - Ändrat från updateDoc() till setDoc() med merge: true
  - Skapar användardokument automatiskt om det inte finns
  - Fixar "No document to update"-fel vid anonym inloggning
  - Initialt saldo: 100 Hearts
  - Standardnamn: "Testanvändare (Du)" för dev, email för testanvändare

- **Toast-varaktigheter**: Längre visningstider för läsbarhet
  - Framgångsmeddelanden: 4 sekunder (var 3)
  - Offline-info: 5 sekunder (var 4)
  - Data uppdaterad: 3 sekunder (var 2)
  - Ger användare tid att läsa meddelanden

### Tekniskt
- useSnackbar hook: Återanvändbar toast-hantering
- SafeAreaView-wrappers: Korrekt JSX-struktur för Snackbar-placering
- react-native-ble-plx: Bluetooth Low Energy-bibliotek (v3.1+)
- app.json: Bluetooth-permissions och plugin-konfiguration
- Firestore setDoc med merge: Skapa-eller-uppdatera-mönster
- RSSI-algoritm: Haversine-baserad avståndsberäkning från signalstyrka

### Buggfixar
- Fixat "No document to update"-fel vid användarens första inloggning
- Fixat JSX-struktur i alla skärmar med Snackbar (krävde SafeAreaView-wrapper)
- Fixat "grannar hjälpta" räknade skickade istället för mottagna Hearts

### Känt
- Bluetooth mesh-funktionalitet kommenterad i väntan på:
  - Andra testtelefon (mors gamla telefon)
  - EAS development build (Expo Go stöder ej Bluetooth native modules)
- För att aktivera Bluetooth: Kör `eas build --profile development --platform android`

## [0.6.0] - 2026-01-07

### Tillagt
- **Platsbaserade funktioner**: GPS-spårning och grannfiltrering
  - Begär platstillstånd vid första användning
  - Hämtar användarens GPS-koordinater automatiskt
  - Avrundar plats till ~50m för integritetsskydd
  - Uppdaterar plats i Firestore med noggrannhet och tidsstämpel
  - Visar avståndsberäkning till varje granne (t.ex. "120m")
  - Kompassriktning med 8 väderstreck (↑ ↗️ → ↘️ ↓ ↙️ ← ↖️)
  
- **Radiusfiltrering**: Visa endast grannar inom 500m
  - RADIUS_METERS konstant (500m standard)
  - Filtrerar automatiskt grannar utanför radie
  - Sorterar grannar efter avstånd (närmaste först)
  - Header visar antal inom radie: "GRANNAR (2 inom 500m)"
  - Beräknar avstånd för varje granne vid laddning
  
- **Platsuppdatering**: Dra för att uppdatera plats
  - Pull-to-refresh uppdaterar både plats och grannlista
  - Omfiltrerar och sorterar efter ny position
  - Användbart när man rör sig i området

### Förbättrat
- **Grannkort**: Visar avstånd och riktning högst upp
  - Flexbox layout med name till vänster, distance/direction till höger
  - Liten fetstil text (12px) för avståndsinfo
  - Uppdateras automatiskt när plats ändras
  
- **Testdata**: Spridda testanvändare i Upplands Väsby
  - Anna Svensson: ~450m norr
  - Sven Andersson: ~250m väst
  - Maria Johansson: ~90m syd
  - Script för att uppdatera platser: updateTestLocations.ts

- **Demo-förberedelser för Upplands Väsby kommun**:
  - Förbättrade testdata med realistiska krisberedskapsresurser
  - Lagt till fjärde testgranne (Lars Bergström) för bättre demonstration
  - Realistiska resursbeskrivningar (Generator Honda 5kW, Första hjälpen från sjuksköterska, etc.)
  - Lagt till app-logotyp, ikon och splash screen
  - KeyboardAvoidingView i AddResourceScreen (tangentbord döljer inte längre input)
  - Filtrerar bort "Testanvändare"-konton från grannlistan automatiskt
  - App nu redo för demonstration till Tf säkerhetschef Francisca Samuelsson

- **Testresurser uppdaterade**:
  - Anna: Generator Honda 5kW, Första hjälpen-utbildning (sjuksköterska)
  - Sven: Campingkök med gasolflaskor, Behöver torrvaror/konserver
  - Maria: Batteriradio med ficklampor, Vedspis med plats för 8-10 personer
  - Lars: Elverktyg och förlängningssladdar, Volvo XC90 med släp

### Tekniskt
- expo-location för GPS-funktionalitet
- Location.Accuracy.Balanced (balans mellan noggrannhet/batteri)
- Haversine-formel för avståndsberäkning (i meter)
- roundLocationForPrivacy() avrundar till 3 decimaler (~111m precision)
- calculateDistance() beräknar avstånd mellan koordinater
- getDirection() konverterar bearing till 8 kompassriktningar
- formatDistance() visar meter (<1000m) eller kilometer
- Location helpers i src/lib/locationHelpers.ts
- Firebase Admin SDK script för testdatauppdatering
- KeyboardAvoidingView i AddResourceScreen för bättre UX
- Automatisk filtrering av testanvändare (startsWith 'Testanvändare')
- App-ikon: 1200x1200px logotyp med gröna stugor
- Splash screen: Logotyp på forest green bakgrund (#2D5016)
- Uppdaterad seedTestData.ts med realistiska krisberedskapsscenarier

### Säkerhet & Integritet
- Plats avrundad till ~50m (inte exakt adress)
- Användare ser endast andra Stuga-användare inom 500m
- Platsinformation lagras med accuracy-metadata
- Kräver explicit användartillstånd för plats

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
