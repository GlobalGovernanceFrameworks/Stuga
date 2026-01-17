# Changelog

Alla viktiga ändringar i Stuga MVP dokumenteras här.

Formatet baseras på [Keep a Changelog](https://keepachangelog.com/sv-SE/1.0.0/).

## [Unreleased]

### Planerat
- Skapa development build för full notifikationsfunktionalitet
- Testa Bluetooth-upptäckt med två enheter
- Testa med verkliga användare i Upplands Väsby
- Samla feedback från kommunkontakt och pilotanvändare
- Iterera baserat på verklig användning
- Förbered för expansion till fler områden
- Förbättrad platshistorik och tracking
- BankID-integration för produktionsanvändare

## [1.1.4] - 2025-01-17

### Lagt till
- HelpScreen med kompakt accordion-layout
  - 6 expanderbara sektioner: Symboler, Hearts, Kvartersvärd, Offline, Integritet, FAQ
  - 17 emojis/indikatorer dokumenterade med förklaringar
  - Öppnar med "Symboler & Indikatorer" som default
  - Länk till fullständig ANVÄNDARGUIDE.md
- ?-knapp i AppNavigator header (alltid synlig)
  - Placerad till höger om offline-indikator
  - Ger omedelbar åtkomst till hjälp från alla skärmar

### Förbättrat
- Emoji-kongruens mellan HelpScreen och app (100% täckning)
  - Nya sektioner: Resurstyper (📤📥), Hearts-transaktioner (✓⏳)
  - Brådskande-nivåer kompletterade med ⚪ Utgången
  - Alla status-indikatorer dokumenterade (📡🔄🔶)

### Dokumenterat
- EMOJI_AUDIT.md: Fullständig mappning av alla emojis i appen
- HELPSCREEN_INTEGRATION.md: Steg-för-steg installationsguide

## [1.1.3] - 2025-01-17

### Tillagt
- Kvartersvärd-funktionalitet ("Block Captain Lite")
  - `is_block_captain` och `block_captain_phone` i User-modell
  - Opt-in via switch i ProfileScreen
  - BlockCaptainGuideScreen med MSB-baserad krischecklista
  - Viktiga nummer med direktringning (112, kommunen)
  - 🛡️ badge vid kvartersvärdens namn i alla vyer
- Formatering av kontaktdatum i NeighborDetailScreen
  - Visar relativ tid (idag, igår, X dagar sedan)
  - Använder `responded_at` från kontaktförfrågan

### Buggfixar
- Saknad View-import i BlockCaptainGuideScreen
- TODO-kommentar för datuformatering i NeighborDetailScreen

### Ändrat
- RegistrationScreen sätter `is_block_captain: false` som default

## [1.1.2] - 2025-01-16

### Tillagt
- Email/lösenord-autentisering ersätter anonym auth
- LoginScreen med möjlighet att skapa konto eller logga in
- Persistent inloggning (användare förblir inloggade mellan sessioner)
- Återställning av lösenord via email (Firebase-hanterat)

### Buggfixar
- Felaktig notifikationsmetod i useNotifications.ts (.remove() istället för removeNotificationSubscription())
- Dubbelregistrering av användare vid varje appstart

## [1.1.1] - 2026-01-11

### Infrastructure
- **Ny pilotdatabas**: Migrerat till `stuga-vasby-pilot` med optimal regionplacering
  - Firestore: europe-north2 (Stockholm)
  - Functions: europe-north1 (Finland)
  - ~3-4x förbättrad latency för Upplands Väsby-piloten
  - Seedskript uppdaterade för ny databas

🐛 **Buggfix:** Korrigerat distance-visning och user data-flöde mellan screens.

### Buggfixar
- **NeighborDetailScreen distance-visning**: Fixat problem där ingen information visades när man kom från ResourcesScreen
  - Tog bort duplicerad rad (507-508) som visade availability_status ("Tillgänglig"/"Borta") istället för distance
  - Tog bort redundant `calculateDistanceToNeighbor()` funktion
  - Konsoliderade distance-beräkning till en funktion (`loadDistance()`)
  - Tog bort duplicerad import av `formatDistanceFuzzy`
  
- **ResourcesScreen → NeighborDetail navigation**: Fixat incomplete data-överföring
  - ResourcesScreen skickade bara `name` och `user_id` till NeighborDetail
  - Orsakade att hearts_balance, location och display_name saknades
  - Lagt till `allUsers` state för att lagra full user data
  - Hittar och skickar nu komplett user-objekt vid navigation
  - NeighborDetail får nu all nödvändig information från båda navigationsvägarna

### Tekniskt
- Fixat type confusion där distance sattes som både string och number
- Konsoliderad distance-beräkning till en enda funktion
- Städat bort oanvända states (`loadingDistance`, `userLocation` i NeighborDetail)
- Konsekvent användning av `formatDistanceFuzzy()` för display
- ResourcesScreen sparar nu full user data i state för vidarebefordring
- Navigation skickar komplett user-objekt istället för partial data

### Användarupplevelse
- Grannprofiler visar nu alltid korrekt närhetsinformation
- Hearts-saldo visas korrekt ("🔥 245 Hearts" istället för "🔥 Hearts")
- Distance visas korrekt ("📍 Nära" istället för "📍 Borta")
- Konsekvent beteende oavsett navigationsväg:
  - ✅ HomeScreen → NeighborDetail
  - ✅ ResourcesScreen → NeighborDetail

### Root Cause
Problem uppstod från två källor:
1. **NeighborDetailScreen**: Duplicerad kod som visade fel information
2. **ResourcesScreen**: Skickade bara minimal data istället för full user-objekt

Båda problemen skapade ofullständig visning av granninformation.

## [1.1.0] - 2026-01-10

🔒 **Säkerhets- och integritetsuppdatering!** Komplett progressiv disclosure, kontaktförfrågningar och skydd mot missbruk.

### Tillagt
- **Burner Profiles (Visningsnamn)**: Progressiv avslöjande av identitet
  - Separata fält för riktigt namn och visningsnamn vid registrering
  - Auto-genererade namn (Granne #XXXX) som standard om inget anges
  - Riktigt namn visas bara efter accepterad kontakt
  - Display name visas överallt före kontakt (listor, resurser, profiler)
  - Möjlighet att välja eget visningsnamn eller använda auto-genererat
- **Contact Request System**: Samtycke krävs före kontakt
  - "Begär kontakt"-knapp istället för direkt SMS-tillgång
  - Notifikationssystem för väntande förfrågningar
  - ContactRequestsScreen för att hantera inkommande förfrågningar
  - Acceptera/Avböj-funktionalitet med bekräftelsedialoger
  - Telefonnummer och riktigt namn avslöjas endast efter acceptans
  - Status-tracking: none, pending_sent, pending_received, accepted, declined
  - Firestore collection: contact_requests med säkerhetsregler
- **Fuzzy Distance**: Dölj exakt position för anti-triangulering
  - Fyra kategorier istället för exakta meter: "Mycket nära", "Nära", "Inom gångavstånd", "I området"
  - Tar bort kompassriktningar (↗ ← ↓) helt
  - Privacy-inställning för att tillåta exakt avstånd efter accepterad kontakt
  - Förhindrar stalking genom triangulering
- **Block User**: Säkerhetsventil för oönskade användare
  - Blockera-knapp i grannprofil
  - Blockerade användare filtreras från alla listor (Home, Resources)
  - BlockedUsersScreen för att hantera blockerade
  - Avblockera-funktionalitet
  - blocked_users array i user-dokument
  - Blockering är envägskommunikation (blockerad vet inte)
- **Profil-redigering**: Uppdatera namn, visningsnamn och telefonnummer
  - Edit-läge i ProfileScreen med toggle
  - Validering av namn (required) och telefonnummer (svenskt format)
  - Checkbox för att välja auto-genererat namn explicit
  - Dynamisk helper-text baserat på val
  - Avbryt-funktion som återställer värden
  - Spara till Firestore med bekräftelse

### Förbättrat
- **Konsekvent distansfiltrering**: Grannar filtreras på avstånd från första laddningen
  - Hämtar location före laddning av grannar
  - Eliminerar inkonsekvent beteende (alla vid start, filtrerade efter refresh)
  - Konsekvent UX oavsett initial load eller refresh
- **Firebase Security Rules**: Säkra regler för contact_requests-kollektionen
  - Read: Endast involverade parter (from_user eller to_user)
  - Create: Endast avsändare kan skapa förfrågan
  - Update: Endast mottagare kan acceptera/avböja
  - Förhindrar spoofing och obehörig åtkomst
- **Privacy by Design**: Minimal datadelning som standard
  - Display name först, riktigt namn efter samtycke
  - Fuzzy distance som standard, exact efter samtycke
  - Telefonnummer dolt tills kontakt accepterad
  - Användaren har kontroll över disclosure-nivå

### Tekniskt
- Ny komponent: `ContactRequestsScreen` (~200 rader) - Hantera väntande förfrågningar
- Ny komponent: `BlockedUsersScreen` (~150 rader) - Hantera blockerade användare
- Ny helper: `contactHelpers.ts` - Contact request CRUD-operationer
- Ny helper: `blockHelpers.ts` - Block/unblock-funktionalitet
- Ny helper: `displayHelpers.ts` - Display name vs real name helpers
- Uppdaterad: `RegistrationScreen` - Två namn-fält, display name-generering
- Uppdaterad: `NeighborDetailScreen` - Contact request-flöde, block-knapp
- Uppdaterad: `ProfileScreen` - Edit-läge, checkbox för auto-genererat namn
- Uppdaterad: `HomeScreen` - Konsekvent distansfiltrering, blockfiltrering
- Uppdaterad: `ResourcesScreen` - Display names, blockfiltrering
- Uppdaterad: `locationHelpers.ts` - Fuzzy distance-funktioner
- Uppdaterad: `User`-type - display_name, privacy_settings, blocked_users
- Ny collection: `contact_requests` - Förfrågningar mellan användare
- Firebase rules: contact_requests-regler för säker åtkomst

### Buggfixar
- **Navigation error i ProfileScreen**: Lagt till navigation prop för routing
- **Contact accept/decline TODO**: Implementerat med request ID-tracking
- **Inconsistent distance filtering**: Location hämtas före grannladdning
  - Initial load visar nu samma resultat som refresh
  - Eliminerar "alla visas först, sen filtreras"-bug
- **Edit field styling**: Tydliga labels ovanför fält istället för floating labels
  - Bättre läsbarhet på mörk grön bakgrund
  - Vita labels (#FFF) och ljusgrå helper-text (#E0E0E0)
- **Checkbox styling**: Vit bakgrund på checkbox för synlighet mot grön bakgrund
- **Phone number validation**: Accepterar både bindestreck och mellanslag
- **Name overwrite bug**: Använder updateDoc istället av setDoc för location

### Användargränssnitt
- Progressiv disclosure-pattern: Discovery → Reputation → Request → Consent → Contact
- Contact request-knappar: "Begär kontakt", "Väntar på svar...", "Acceptera/Avböj", "Skicka SMS"
- Fuzzy distance-kategorier visuellt tydliga utan exakta meter
- Block-knapp diskret placerad i grannprofil
- Edit-formulär med tydliga labels, helper-text och checkbox för auto-generering
- Bekräftelsedialoger för destructive actions (block, decline contact)
- Privacy settings-sektion i profil med tydliga förklaringar

### Säkerhet & Integritet
- **Purple (Tribal Trust) infrastructure**: Komplett consent-baserad arkitektur
  - Graduated trust: Progressiv avslöjande baserat på relation
  - Consent mechanisms: Explicit godkännande före kontakt
  - Reputation before contact: Se trustworthiness innan exponera data
  - Fuzzy proximity: Förhindra exakt positionering
  - Reciprocal disclosure: Båda parter måste samtycka
- **Anti-stalking skydd**: Kombinationen fuzzy distance + contact requests
  - Omöjligt att triangulera exakt position
  - Omöjligt att kontakta utan samtycke
  - Blockering filtrerar helt från alla vyer
- **Privacy controls**: Användaren styr disclosure-nivå
  - Kan välja anonymt display name
  - Kan neka kontaktförfrågningar
  - Kan blockera oönskade användare
  - Privacy settings för exact distance (opt-in)

### Krisberedskap
- **SMS-kontakt efter samtycke**: Fungerar vid överbelastning men kräver tillstånd
- **Fuzzy distance bibehållen**: Även i kris, privacy-by-design
- **Blockering fungerar offline**: SQLite-baserad filtrering
- **Samtycke fungerar offline**: Queued contact requests synkas vid återanslutning

### Bioregional vision
- **Trust infrastructure**: Purple-nivå färdigbyggd
  - Foundation för Red (leadership) och Blue (governance) nivåer
  - Progressive disclosure möjliggör säker skalning
  - Consent mechanisms gör systemet self-governing

### Pilot-redo förbättringar
- ✅ Skydd mot missbruk (stalking, harassment)
- ✅ GDPR-kompatibel design (minimal data, user control)
- ✅ Professionell användarupplevelse
- ✅ Francisca kan säkert demonstrera för kommun
- ✅ Verkliga användare kan känna sig trygga

### Firebase-konfiguration
- Nya security rules för contact_requests-kollektionen
- Deployment: `firebase deploy --only firestore:rules`
- Testning: Rules fungerar korrekt för privacy protection

### Nästa steg
- Reputation system (Purple - trust signals)
- Availability tracking (Purple - presence)
- Demo polish för presentation
- Real-world pilot testing i Upplands Väsby

---

## Sammanfattning v1.1.0

**Från:** Pilot-klar app med grundläggande funktioner  
**Till:** Säker app med komplett privacy infrastructure

**Impact:** Nu säker nog för verklig pilot med okända användare. Vår kontakt hos kommunen kan demonstrera robust integritetsskydd för Upplands Väsby kommun.

**Key features:** Progressive disclosure, consent-based contact, anti-stalking protection, user control.

## [1.0.0] - 2026-01-10

🎉 **Första pilot-redo versionen!** Komplett användarregistrering, resurshantering, och kommunikation.

### Tillagt
- **Användarregistrering**: Komplett onboarding-flöde för nya användare
  - Namn och telefonnummer-input med validering
  - Automatisk platsbehörighet
  - Geografisk begränsning till Upplands Väsby kommun (10km radie)
  - Sparar användarprofil i Firestore
  - Persistent inloggning (skippar registrering vid återkomst)
  - Visas automatiskt för nya användare
- **Redigera resurser**: Komplett redigeringsfunktionalitet för befintliga resurser
  - Förifyllda fält med befintlig data
  - Möjlighet att ändra titel, beskrivning, kategori och typ
  - Kan lägga till eller ta bort utgångsdatum
  - "Redigera"-knapp i Mina resurser-skärmen
  - Valfri redigeringsknapp i NeighborDetail för egna resurser
- **Resurs-browsing**: Ny "Resurser"-skärm för resurs-centrerad upptäckt
  - Sökfält för snabb filtrering av resurser
  - Kategori-filter med horisontell scroll (Mat, Värme, Verktyg, etc.)
  - Erbjuder/Behöver-toggle för att filtrera resurstyp
  - Smart sortering: brådskande resurser först, sedan avstånd
  - Visar ägare, avstånd och riktning för varje resurs
  - Klicka på resurs för att se ägarens profil
  - Räknare visar antal filtrerade resurser
- **SMS-kontakt**: Funktionell kommunikation mellan grannar
  - "Skicka SMS"-knapp ersätter tidigare placeholder
  - Öppnar enhetens SMS-app med förifyllt nummer
  - Graceful fallback om telefonnummer saknas
  - Fungerar på både iOS och Android
  - Perfekt för krisberedskap (SMS fungerar även när mobildata är överbelastad)
- **Push-notifikationer**: Notifikationssystem för brådskande resurser
  - Begär notifikationstillstånd vid första körningen
  - Sparar FCM-token i Firestore
  - Notifierar grannar inom 500m vid brådskande resurser (< 24h)
  - Klicka på notifikation för att öppna Resources-skärmen
  - Stöd för både lokal testning och Cloud Functions (produktion)
  - Fungerar på fysiska enheter (kräver development build)
- **Notification icon**: SVG-ikoner baserade på Stuga-logotypen
  - Två varianter: tre hus och förenklad version
  - Vit på transparent för Android Material Design
  - Optimerad för 96x96 pixels

### Förbättrat
- **Pilot-redo onboarding**: Användare kan registrera sig själva
- **Geografisk begränsning**: Naturlig gräns för pilot-scope (Upplands Väsby)
- **Komplett CRUD**: Nu finns Create, Read, Update och Delete för resurser
- **Resurssökning**: Användare kan söka i titel, beskrivning och ägarnamn
- **Filtrering**: Tre nivåer av filtrering (sök, kategori, typ) kan kombineras
- **Autentiseringsflöde**: Förenklad och automatiserad inloggning
- **Platshantering**: Uppdaterar endast plats, skriver inte över användardata
- **Telefonnummervalidering**: Stöder både mellanslag och bindestreck i format

### Tekniskt
- Ny komponent: `RegistrationScreen` (~300 rader) - Komplett användarregistrering
- Ny komponent: `EditResourceScreen` (~300 rader) - Resursredigering med förifyllda fält
- Ny komponent: `ResourcesScreen` (~350 rader) - Resurs-browsing med avancerad filtrering
- Ny helper: `notificationHelpers.ts` - Notifikationsbehörighet och token-hantering
- Ny hook: `useNotifications.ts` - Notifikationslogik och navigation
- Uppdaterad: `App.tsx` - Registreringsflöde och notifikationsnavigation
- Uppdaterad: `NeighborDetailScreen` - SMS-funktionalitet med React Native Linking API
- Uppdaterad: `MyResourcesScreen` - "Redigera"-knapp för öppna resurser
- Uppdaterad: `HomeScreen` - "Resurser"-knapp i header, förenklad autentisering, FCM-token
- Uppdaterad: `AddResourceScreen` - Notifikationslogik för brådskande resurser
- Uppdaterad: `AppNavigator` - Nya rutter för EditResource och Resources
- Uppdaterad: `User`-type - Fält för phone_number, fcm_token, registration_completed
- Cloud Functions: `notifyUrgentResource` - Push-notifikationer vid brådskande resurser
- Cloud Functions: `notifyHeartsReceived` - Implementerad från TODO
- Dependencies: expo-notifications för push-notifikationer

### Buggfixar
- **Safe area på Android**: NeighborDetailScreen scrollar tillräckligt så knappar inte hamnar under navigation bar
- **Kategori-chipsspacing**: Fixad layout för kategori-filter (explicit marginRight istället för gap)
- **Namn skrivs över**: HomeScreen använder updateDoc istället av setDoc för att bevara användarnamn
- **Telefonnummervalidering**: Accepterar nu både mellanslag och bindestreck i telefonnummer
- **Platsuppdatering**: Uppdaterar endast location-fält, skriver inte över andra användarfält

### Användargränssnitt
- Välkomstskärm med Stuga-branding och pilotinformation
- Sökfält med tydlig placeholder i ResourcesScreen
- Segmenterade knappar för Alla/Erbjuder/Behöver
- Horisontell scroll för kategorier (9 kategorier)
- Ikoner för resurstyp: 📤 Erbjuder, 📥 Behöver
- Brådskanhets-badge och tidsräknare på varje resurs
- Avstånd och kompassriktning visas för varje resurs
- Professionell registreringsupplevelse

### Krisberedskap
- **SMS-infrastruktur**: Utnyttjar befintligt SMS-nätverk som fungerar även vid överbelastning
- **Resurssökning**: Snabb upptäckt av kritiska resurser ("generator", "mat", etc.)
- **Brådskanhetsprioritet**: Akuta behov visas först automatiskt
- **Avståndsbaserad sortering**: Närmaste hjälp visas först inom samma brådskanshetsnivå
- **Push-notifikationer**: Väcker grannar för verkliga nödsituationer
- **Geografisk begränsning**: Säkerställer relevant grannskap

### Bioregional vision
- **Geografisk validering**: Proof of concept för bioregional governance
- **Upplands Väsby-gräns**: Första steget mot bioregioner
- **Skalbar arkitektur**: Lätt att expandera till fler områden eller bioregioner
- **GGF-förberedelse**: Teknisk grund för framtida bioregional koordinering

### Pilot-klar
- ✅ Användarregistrering med självbetjäning
- ✅ Geografisk begränsning till pilotområde
- ✅ Komplett resurshantering (CRUD)
- ✅ Funktionell kommunikation (SMS)
- ✅ Resurssökning och filtrering
- ✅ Notifikationer för brådskande situationer
- ✅ Professionell användarupplevelse
- ✅ Redo för verkliga användare i Upplands Väsby

### Installation och setup
- Kräver fysisk enhet för notifikationstestning
- Development build rekommenderas för full funktionalitet
- Expo Go stöder lokal notifikationstestning
- Firebase Cloud Functions valfritt för produktion

## [0.9.0] - 2026-01-09

### Tillagt
- **Redigera resurser**: Komplett redigeringsfunktionalitet för befintliga resurser
  - Förifyllda fält med befintlig data
  - Möjlighet att ändra titel, beskrivning, kategori och typ
  - Kan lägga till eller ta bort utgångsdatum
  - "Redigera"-knapp i Mina resurser-skärmen
  - Valfri redigeringsknapp i NeighborDetail för egna resurser
- **Resurs-browsing**: Ny "Resurser"-skärm för resurs-centrerad upptäckt
  - Sökfält för snabb filtrering av resurser
  - Kategori-filter med horisontell scroll (Mat, Värme, Verktyg, etc.)
  - Erbjuder/Behöver-toggle för att filtrera resurstyp
  - Smart sortering: brådskande resurser först, sedan avstånd
  - Visar ägare, avstånd och riktning för varje resurs
  - Klicka på resurs för att se ägarens profil
  - Räknare visar antal filtrerade resurser
- **SMS-kontakt**: Funktionell kommunikation mellan grannar
  - "Skicka SMS"-knapp ersätter tidigare placeholder
  - Öppnar enhetens SMS-app med förifyllt nummer
  - Graceful fallback om telefonnummer saknas
  - Fungerar på både iOS och Android
  - Perfekt för krisberedskap (SMS fungerar även när mobildata är överbelastad)
- **Telefonnummer i testdata**: Test-användare har nu telefonnummer

### Förbättrat
- **Komplett CRUD**: Nu finns Create, Read, Update och Delete för resurser
- **Resurssökning**: Användare kan söka i titel, beskrivning och ägarnamn
- **Filtrering**: Tre nivåer av filtrering (sök, kategori, typ) kan kombineras
- **Tom-state meddelanden**: Tydliga meddelanden när inga resurser matchar filter

### Tekniskt
- Ny komponent: `EditResourceScreen` (~300 rader) - Resursredigering med förifyllda fält
- Ny komponent: `ResourcesScreen` (~350 rader) - Resurs-browsing med avancerad filtrering
- Uppdaterad: `NeighborDetailScreen` - SMS-funktionalitet med React Native Linking API
- Uppdaterad: `MyResourcesScreen` - "Redigera"-knapp för öppna resurser
- Uppdaterad: `HomeScreen` - "Resurser"-knapp i header för snabb åtkomst
- Uppdaterad: `AppNavigator` - Nya rutter för EditResource och Resources
- Uppdaterad: `User`-type - Lagt till valfritt `phone_number`-fält
- Uppdaterad: Testdata - Telefonnummer för alla test-användare

### Buggfixar
- **Safe area på Android**: NeighborDetailScreen scrollar nu tillräckligt långt så att knappar inte hamnar under Android navigation bar
- **Kategori-chipsspacing**: Fixad layout för kategori-filter (explicit marginRight istället för gap)

### Användargränssnitt
- Sökfält med tydlig placeholder i ResourcesScreen
- Segmenterade knappar för Alla/Erbjuder/Behöver
- Horisontell scroll för kategorier (9 kategorier)
- Ikoner för resurstyp: 📤 Erbjuder, 📥 Behöver
- Brådskanhets-badge och tidsräknare på varje resurs
- Avstånd och kompassriktning visas för varje resurs

### Krisberedskap
- **SMS-infrastruktur**: Utnyttjar befintligt SMS-nätverk som fungerar även vid överbelastning
- **Resurssökning**: Snabb upptäckt av kritiska resurser ("generator", "mat", etc.)
- **Brådskanhetsprioritet**: Akuta behov visas först automatiskt
- **Avståndsbaserad sortering**: Närmaste hjälp visas först inom samma brådskanshetsnivå

## [0.8.0] - 2026-01-09

### Tillagt
- **Resursbrådskande karaktär**: Visuella indikatorer för tidskänsliga resurser
  - Valfritt utgångsdatum när resurser läggs till
  - Snabbval: 6 timmar, 24 timmar, 3 dagar, 1 vecka
  - Live-förhandsgranskning av utgångstid
  - Fyra nivåer av brådskande karaktär:
    - 🔴 Brådskande (< 24 timmar) - Röd
    - 🟡 Snart utgången (< 7 dagar) - Orange
    - 🟢 Tillgänglig (> 7 dagar) - Grön
    - ⚪ Utgången - Filtreras automatiskt bort
  - UrgencyBadge-komponent visar ikon + tid kvar
  - Tidsvisning: "6 tim kvar", "Utgår imorgon", "3 dagar kvar"
  
- **Resurshantering**: Komplett livscykelhantering för resurser
  - Ny "Mina resurser"-skärm ersätter enkel Ta bort-skärm
  - Tre filtervyer: Öppna (aktiva), Slutförda, Alla
  - Live-räkning per filter: "Öppna (3)", "Slutförda (2)"
  - Markera som slutförd: "Slutförd"-knapp → status='completed' + genomstruken text
  - Återöppna resurser: "Återöppna"-knapp återställer till 'open'-status
  - Ta bort resurser: bekräftelse krävs för permanent borttagning
  - Visuella tillstånd: slutförd (gråtonad), utgången (orange ram)
  - Sorterat efter created_at (nyaste först)

- **Testdata med brådskande karaktär**: Demo-redo scenarier
  - seedTestDataWithUrgency.ts skapar resurser med utgångstider
  - addUrgencyToTestData.ts lägger till utgångstider till befintliga resurser
  - Visar alla nivåer:
    - 🔴 BRÅDSKANDE: Torrvaror (6h), Första hjälpen (12h)
    - 🟡 SNART: Campingkök (2d), Vedspis (3d)
    - 🟢 TILLGÄNGLIG: Generator (1v), Fyrhjulsdrift (2v)
    - ⚪ INGEN UTGÅNG: Batteriradio, Elverktyg

### Förbättrat
- **Navigation**: Hemskärm uppdaterad
  - Ersatt [Ta bort]-knapp med [Mina resurser]
  - Grön färg (#6BCF7F) för positiv handling
  - Ikon ändrad till 'view-list'
  - MyResources-rutt tillagd i AppNavigator

- **Smart filtrering**: Utgångna resurser hanteras intelligent
  - "Öppna"-filter döljer utgångna (även om status='open')
  - "Slutförda"-filter visar slutföringshistorik
  - "Alla"-filter visar komplett resurslivscykel
  - Tomma tillstånd anpassade per filter

### Tekniskt
- expiryHelpers.ts: Brådskande karaktärs-logik, tidsformatering
  - calculateExpiryTimestamp() skapar utgångstidpunkt från timmar
  - isExpired() kontrollerar om resurs har gått ut
  - getUrgencyInfo() returnerar nivå, färg, ikon, tid kvar
  - formatTimeRemaining() visar läsbar tid
  - getExpiryOptions() tillhandahåller UI-val
- UrgencyBadge-komponent: Visuell brådskande karaktärsindikator
- MyResourcesScreen: Fullständig resurshantering (350 rader)
- Firebase-konfiguration: Memory cache istället för persistent
  - localCache: { kind: 'memory' } i initializeFirestore()
  - Eliminerar "BloomFilter error"-varning
  - Ingen funktionalitetsförlust (SQLite hanterar offline)
  - Enklare arkitektur (en offline-cache istället för dubbel)

### Buggfixar
- **Firebase BloomFilter-varning**: Åtgärdad
  - Konflikt mellan Firestore persistent cache och SQLite offline-kö
  - Ändrat till memory cache undviker konflikt
  - Varning eliminerad

### Känt
- Utgångna resurser visas fortfarande i "Alla"-filter med orange ram
- Perfekt för krisberedskapsdemos: tidskänslig koordination matchar verkliga scenarier

---

**Filer skapade:**
- src/lib/expiryHelpers.ts
- src/components/UrgencyBadge.tsx
- src/screens/MyResourcesScreen.tsx
- src/scripts/seedTestDataWithUrgency.ts
- src/scripts/addUrgencyToTestData.ts

**Filer modifierade:**
- src/screens/AddResourceScreen.tsx
- src/screens/NeighborDetailScreen.tsx
- src/screens/HomeScreen.tsx
- src/navigation/AppNavigator.tsx
- src/config/firebase.ts

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
