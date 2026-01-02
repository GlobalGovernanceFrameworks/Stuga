# Changelog

Alla viktiga ändringar i Stuga MVP dokumenteras här.

Formatet baseras på [Keep a Changelog](https://keepachangelog.com/sv-SE/1.0.0/).

## [Unreleased]

### Planerat
- Offline-stöd med lokal databas
- BankID-integration
- Bluetooth granndiscovery
- Push-notifikationer

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
