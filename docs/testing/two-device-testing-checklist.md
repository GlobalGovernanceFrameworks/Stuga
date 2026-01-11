# Stuga Two-Device Testing Checklist

Komplett testning av Stuga med två enheter för att verifiera all funktionalitet före pilot.

---

## Setup (Innan testning)

### Device A (Din huvudtelefon)
- [ ] Installera senaste version av Stuga
- [ ] Logga in på ditt huvudkonto (test@stuga.local ELLER ditt riktiga konto)
- [ ] Verifiera att testdata finns (kör seed-script om behövs)
- [ ] Full batteriladdning
- [ ] WiFi och Mobile Data aktiverat
- [ ] Bluetooth aktiverat
- [ ] Location permissions granted
- [ ] Notifications aktiverade

### Device B (Mammas gamla telefon)
- [ ] Installera senaste version av Stuga
- [ ] Skapa nytt testkonto (test2@stuga.local ELLER anonymt)
- [ ] Full batteriladdning
- [ ] WiFi och Mobile Data aktiverat
- [ ] Bluetooth aktiverat
- [ ] Location permissions granted
- [ ] Notifications aktiverade

### Miljö
- [ ] Båda telefonerna på samma WiFi-nätverk
- [ ] Telefonerna inom 5-10 meter från varandra (för Bluetooth)
- [ ] Anteckningsblock för att dokumentera buggar
- [ ] Timer/klocka för att mäta synk-tider

---

## Test 1: Basic Registration & Discovery

### Device A (befintligt konto)
- [ ] Öppna Stuga
- [ ] Verifiera att appen laddar HomeScreen
- [ ] Se att andra testanvändare visas (Anna, Sven, etc.)

### Device B (nytt konto)
- [ ] Öppna Stuga första gången
- [ ] Genomgå registreringsflödet:
  - [ ] Namn (använd "Test User B")
  - [ ] Display name (använd "Tester B")
  - [ ] Location permission granted
  - [ ] Registrering slutförd

### Verification
- [ ] **Device A**: Pull to refresh → Device B dyker upp i listan
- [ ] **Device B**: Pull to refresh → Device A dyker upp i listan
- [ ] Båda visar korrekt fuzzy distance ("Mycket nära" om <100m)
- [ ] Display names visas korrekt

**PASS/FAIL:** ___________

**Notes:**
_____________________________________________________________
_____________________________________________________________

---

## Test 2: Contact Request Flow

### Device A → Device B (Skicka förfrågan)
- [ ] Klicka på "Test User B" i grannlistan
- [ ] Verifiera att display name visas ("Tester B"), INTE riktigt namn
- [ ] Klicka "Begär kontakt"
- [ ] Bekräfta i dialogen
- [ ] Vänta på "Skickat!" meddelande
- [ ] Knappen ändras till "Väntar på svar..."

### Device B (Ta emot förfrågan)
- [ ] **Vänta 5-10 sekunder** för notifikation (om notifications fungerar)
- [ ] Gå till grannprofilen för Device A
- [ ] Verifiera att "Acceptera" och "Avböj" knappar visas
- [ ] Klicka "Acceptera"
- [ ] Bekräfta i dialogen
- [ ] Se "Kontakt accepterad!" meddelande

### Verification
- [ ] **Device A**: Knappen ändras till "Skicka SMS"
- [ ] **Device A**: Ser nu Device B's riktiga namn
- [ ] **Device B**: Knappen ändras till "Skicka SMS"
- [ ] **Device B**: Ser nu Device A's riktiga namn
- [ ] Båda kan se varandras telefonnummer (vid SMS-klick)

**PASS/FAIL:** ___________

**Notes:**
_____________________________________________________________
_____________________________________________________________

---

## Test 3: Contact Request Decline

### Setup
- [ ] Device A skickar contact request till en annan testanvändare (t.ex. Anna)
- [ ] Device B (logga in som Anna om möjligt, annars skippa detta test)

### Device B (Decline)
- [ ] Se väntande förfrågan från Device A
- [ ] Klicka "Avböj"
- [ ] Bekräfta

### Verification
- [ ] **Device A**: Knappen visar "Kontakt avböjd" (disabled)
- [ ] **Device A**: Kan INTE skicka SMS
- [ ] **Device B**: Förfrågan försvinner från listan

**PASS/FAIL:** ___________

**Notes:**
_____________________________________________________________
_____________________________________________________________

---

## Test 4: Hearts Transaction (After Contact Accepted)

### Device A → Device B (Skicka Hearts)
- [ ] Gå till Device B's profil
- [ ] Klicka "Skicka Hearts"
- [ ] Välj 50 Hearts
- [ ] Skriv reason: "Tack för testet!"
- [ ] Klicka "Skicka Hearts"
- [ ] Vänta på bekräftelse

### Device B (Ta emot Hearts)
- [ ] Gå till Hearts History
- [ ] Se transaktion från Device A
- [ ] Verifiera: 50 Hearts, rätt reason
- [ ] Klicka "Bekräfta mottagning"

### Verification
- [ ] **Device A**: Hearts History visar skickad transaktion (✓ bekräftad)
- [ ] **Device A**: Saldo minskat med 50
- [ ] **Device B**: Hearts History visar mottagen transaktion
- [ ] **Device B**: Saldo ökat med 50

**PASS/FAIL:** ___________

**Notes:**
_____________________________________________________________
_____________________________________________________________

---

## Test 5: Resource Creation & Discovery

### Device A (Skapa resurs)
- [ ] Klicka "Lägg till"
- [ ] Välj "Erbjuder"
- [ ] Välj kategori "Mat 🥪"
- [ ] Titel: "Test-bröd"
- [ ] Beskrivning: "För testning"
- [ ] Klicka "Spara resurs"
- [ ] Se bekräftelse

### Device B (Hitta resurs)
- [ ] **Vänta 5 sekunder** (för Firestore sync)
- [ ] Öppna Resources-skärmen
- [ ] Pull to refresh
- [ ] Sök efter "Test-bröd"
- [ ] Verifiera att Device A's resurs visas
- [ ] Klicka på resursen
- [ ] Se Device A's profil

### Verification
- [ ] Resursen synlig på Device B
- [ ] Korrekt owner name (Device A's display name)
- [ ] Fuzzy distance visas
- [ ] Kategori korrekt (Mat 🥪)

**PASS/FAIL:** ___________

**Notes:**
_____________________________________________________________
_____________________________________________________________

---

## Test 6: Resource Deletion

### Device A (Ta bort resurs)
- [ ] Klicka "Ta bort"
- [ ] Välj "Test-bröd"
- [ ] Bekräfta borttagning
- [ ] Se bekräftelse

### Device B (Verifiera borttagning)
- [ ] **Vänta 5 sekunder**
- [ ] Resources → Pull to refresh
- [ ] Verifiera att "Test-bröd" INTE längre visas

**PASS/FAIL:** ___________

**Notes:**
_____________________________________________________________
_____________________________________________________________

---

## Test 7: Block User Functionality

### Device A (Blockera Device B)
- [ ] Gå till Device B's profil
- [ ] Scrolla ner till "Blockera"
- [ ] Klicka "Blockera"
- [ ] Bekräfta
- [ ] Se "Blockerad" meddelande

### Verification
- [ ] **Device A**: Device B försvinner från HomeScreen
- [ ] **Device A**: Device B försvinner från Resources
- [ ] **Device A**: Kan INTE hitta Device B via sökning
- [ ] **Device B**: Kan fortfarande se Device A (envägsblockning)

### Device A (Avblockera)
- [ ] Gå till Profil → Blockerade användare
- [ ] Se Device B i listan
- [ ] Klicka "Avblockera"
- [ ] Bekräfta

### Verification
- [ ] **Device A**: Device B dyker upp igen i HomeScreen
- [ ] **Device A**: Device B synlig i Resources

**PASS/FAIL:** ___________

**Notes:**
_____________________________________________________________
_____________________________________________________________

---

## Test 8: Offline Mode - Queue Transactions

### Setup
- [ ] Båda devices online och synkade

### Device A (Gå offline)
- [ ] Stäng av WiFi
- [ ] Stäng av Mobile Data
- [ ] Vänta tills "🔡 Offline-läge" banner visas

### Device A Offline Actions
- [ ] Skapa en resurs: "Offline-resurs"
  - [ ] Se "🔦 Resurs köas..." meddelande
- [ ] Skicka Hearts till Device B (om kontakt accepterad): 25 Hearts
  - [ ] Se "🔦 Hearts köas..." meddelande
- [ ] Verifiera att actions sparas lokalt (inga error)

### Device B (Vänta)
- [ ] **Vänta 10 sekunder**
- [ ] Pull to refresh
- [ ] Verifiera att "Offline-resurs" INTE syns än
- [ ] Verifiera att Hearts INTE mottagits än

### Device A (Gå online igen)
- [ ] Slå på WiFi
- [ ] Vänta på "🔄 Synkroniserar..." meddelande
- [ ] Se "✅ Synkat!" meddelande

### Device B (Verifiera sync)
- [ ] **Vänta 10 sekunder**
- [ ] Pull to refresh Resources
- [ ] Verifiera att "Offline-resurs" NU visas
- [ ] Gå till Hearts History
- [ ] Verifiera att 25 Hearts från Device A visas

**PASS/FAIL:** ___________

**Sync time:** _________ sekunder

**Notes:**
_____________________________________________________________
_____________________________________________________________

---

## Test 9: Offline Mode - Intermittent Connection

### Device A
- [ ] Stäng av WiFi/Data
- [ ] Skapa resurs: "Intermittent Test 1"
- [ ] Slå PÅ WiFi för 5 sekunder
- [ ] Vänta på sync
- [ ] Stäng av WiFi igen
- [ ] Skapa resurs: "Intermittent Test 2"
- [ ] Slå PÅ WiFi för 5 sekunder
- [ ] Vänta på sync

### Device B
- [ ] Pull to refresh flera gånger
- [ ] Verifiera att BÅDA resurser synkas korrekt
- [ ] Kontrollera att ordningen är korrekt (1 före 2)

**PASS/FAIL:** ___________

**Notes:**
_____________________________________________________________
_____________________________________________________________

---

## Test 10: Bluetooth Discovery (Om implementerat)

### Setup
- [ ] Båda devices på samma WiFi
- [ ] Bluetooth aktiverat på båda
- [ ] Placera devices 2-5 meter från varandra

### Device A
- [ ] Öppna HomeScreen
- [ ] Leta efter Bluetooth-ikon (🔶) bredvid grannar

### Device B
- [ ] Samma som Device A

### Verification
- [ ] Bluetooth mesh-status visar "🟢 Aktiv"
- [ ] Grannar inom Bluetooth-räckvidd (<50m) markeras med 🔶
- [ ] Mesh status visar antal upptäckta enheter

**PASS/FAIL:** ___________

**Bluetooth range:** _________ meter

**Notes:**
_____________________________________________________________
_____________________________________________________________

---

## Test 11: Distance Accuracy

### Setup
- [ ] Placera devices på kända avstånd (använd GPS-app för att verifiera)

### Test olika avstånd
- [ ] **<50m**: Båda visar "Mycket nära"
- [ ] **100-200m**: Båda visar "Nära"
- [ ] **250-400m**: Båda visar "Inom gångavstånd"
- [ ] **>500m**: Device försvinner från lista (utanför radius)

### Verification
- [ ] Fuzzy distance kategorier stämmer med faktiskt avstånd
- [ ] Filtering på 500m fungerar korrekt

**PASS/FAIL:** ___________

**Notes:**
_____________________________________________________________
_____________________________________________________________

---

## Test 12: Profile Editing

### Device A
- [ ] Gå till Profil → Redigera
- [ ] Ändra display name till "Updated Name"
- [ ] Spara

### Device B
- [ ] **Vänta 5 sekunder**
- [ ] Pull to refresh HomeScreen
- [ ] Verifiera att Device A's namn är "Updated Name"

**PASS/FAIL:** ___________

**Notes:**
_____________________________________________________________
_____________________________________________________________

---

## Test 13: Urgency System

### Device A (Skapa brådskande resurs)
- [ ] Lägg till resurs med expiry om 2 timmar
- [ ] Kategori: "Mat 🥪"
- [ ] Titel: "Varm mat - utgår om 2h"

### Device B
- [ ] Resources → Pull to refresh
- [ ] Verifiera att resursen har 🔴 BRÅDSKANDE badge
- [ ] Verifiera att den sorteras FÖRST i listan

### Wait 2+ hours (eller ändra expiry manuellt i Firestore)
- [ ] Device B: Pull to refresh
- [ ] Verifiera att resursen INTE längre visas (expired)

**PASS/FAIL:** ___________

**Notes:**
_____________________________________________________________
_____________________________________________________________

---

## Test 14: Edge Cases

### Test A: Rapid refresh
- [ ] Device A: Pull to refresh 10 gånger snabbt
- [ ] Ingen krasch
- [ ] Data laddar korrekt

### Test B: Background/Foreground
- [ ] Device A: Gå till hemskärmen (background Stuga)
- [ ] Vänta 30 sekunder
- [ ] Öppna Stuga igen
- [ ] Data fortfarande korrekt
- [ ] Ingen krasch

### Test C: No internet on startup
- [ ] Device A: Stäng av WiFi/Data
- [ ] Force quit Stuga
- [ ] Öppna Stuga
- [ ] Verifiera att appen startar i offline-läge
- [ ] Ingen krasch

### Test D: Switch accounts (om möjligt)
- [ ] Device A: Logga ut
- [ ] Logga in med annat konto
- [ ] Verifiera att data uppdateras korrekt
- [ ] Ingen data-läckage från föregående konto

**PASS/FAIL:** ___________

**Notes:**
_____________________________________________________________
_____________________________________________________________

---

## Test 15: Performance & Battery

### Device A (Mät över 30 minuter)
- [ ] Notera batteriprocent vid start: ______%
- [ ] Använd appen normalt i 30 min (mix av skärmar, refresh, etc.)
- [ ] Notera batteriprocent efter 30 min: ______%
- [ ] **Battery drain:** ______% per timme
- [ ] Acceptabelt: <10% per timme

### Device A (Mät memory)
- [ ] Öppna Settings → Battery/Memory
- [ ] Notera Stuga's memory usage: _______ MB
- [ ] Acceptabelt: <200 MB

### Device A (Responsiveness)
- [ ] Alla skärmar laddar snabbt (<2 sek)
- [ ] Inga laggar vid scrollning
- [ ] Refresh fungerar smidigt

**PASS/FAIL:** ___________

**Battery drain:** ______% per timme

**Memory usage:** _______ MB

**Notes:**
_____________________________________________________________
_____________________________________________________________

---

## Test 16: Real-World Scenario (Simulerad kris)

### Scenario: Strömavbrott i 4 timmar

**T=0 (Ström går):**
- [ ] Device A: Stäng av WiFi
- [ ] Device B: Stäng av WiFi
- [ ] Båda: Verifiera offline-läge aktivt

**T=30min (Anna behöver hjälp):**
- [ ] Device A: Skapa NEED: "Behöver ficklampa" (brådskande, 2h)
- [ ] Verifiera att den köas offline

**T=1h (Nätet kommer tillbaka 5 min):**
- [ ] Device A: Slå på WiFi
- [ ] Vänta på sync
- [ ] Device B: Slå på WiFi
- [ ] Device B: Se Device A's behov
- [ ] Device B: Skapa OFFER: "Har ficklampa"
- [ ] Båda: Stäng av WiFi igen

**T=2h (Sven hittar Device B's erbjudande):**
- [ ] Device A: Slå på WiFi (5 min)
- [ ] Se Device B's erbjudande
- [ ] Skicka kontaktförfrågan (om inte redan accepterad)
- [ ] Stäng av WiFi

**T=4h (Ström tillbaka):**
- [ ] Båda: Slå på WiFi
- [ ] Verifiera att all data synkat korrekt
- [ ] Contact request accepterad
- [ ] Alla resurser synliga
- [ ] Hearts transaktioner (om skickade) synkade

### Verification
- [ ] Offline queueing fungerade
- [ ] Intermittent sync fungerade
- [ ] Ingen data förlorad
- [ ] Ingen duplikat-data
- [ ] Användarna kunde koordinera hjälp

**PASS/FAIL:** ___________

**Notes:**
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________

---

## Summary

### Tests Passed: _____ / 16

### Critical Issues Found:
1. _____________________________________________________________
2. _____________________________________________________________
3. _____________________________________________________________

### Minor Issues Found:
1. _____________________________________________________________
2. _____________________________________________________________
3. _____________________________________________________________

### Performance Notes:
_____________________________________________________________
_____________________________________________________________

### Ready for Pilot? YES / NO

### Actions Before Pilot:
- [ ] _____________________________________________________________
- [ ] _____________________________________________________________
- [ ] _____________________________________________________________

---

## Signoff

**Tester:** _________________________  
**Date:** _________________________  
**Devices Used:**  
- Device A: _________________________  
- Device B: _________________________  

**Overall Assessment:**
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________

---

**Next Steps:**
1. Fix all critical issues
2. Re-test failed scenarios
3. Document all bugs in GitHub issues
4. Prepare for pilot deployment
