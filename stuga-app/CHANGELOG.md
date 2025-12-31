# Changelog

Alla viktiga ändringar i Stuga MVP dokumenteras här.

Formatet baseras på [Keep a Changelog](https://keepachangelog.com/sv-SE/1.0.0/).

## [Unreleased]

### Planerat
- Validering av Hearts-saldo (förhindra överskridande)
- Offline-stöd med lokal databas
- BankID-integration
- Bluetooth granndiscovery
- Push-notifikationer

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
