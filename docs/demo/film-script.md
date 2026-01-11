# Stuga Demo-script v1.1.0 (2-3 minuter)

Uppdaterad för att visa registrering, resurssökning, privacy-funktioner och offline-resiliens.

---

## 0:00 - 0:20 (Intro + Problem)

**Script:**
"Hej Francisca. Här är Stuga – verktyget jag bygger för att göra Upplands Väsby mer resilient. Vid en kris är grannsamverkan vår viktigaste resurs. Men idag saknar vi infrastrukturen för att samordna den lokalt när internet ligger nere. Stuga löser detta."

**Visa:** 
- Stuga-logo på telefon
- Eller: HomeScreen med grannar

---

## 0:20 - 0:45 (Registration + Geographic Boundary)

**Script:**
"När någon registrerar sig begär vi plats-tillstånd och verifierar att de faktiskt bor i Upplands Väsby kommun – detta är en pilot för just vårt område. Appen validerar att du är inom 10 kilometer från Väsby centrum. Det bygger tillit att alla är faktiska grannar, inte folk från andra kommuner."

**Visa:**
1. RegistrationScreen (eller mock)
2. Karta som visar 10km-cirkeln (optional)
3. "Registrering godkänd" meddelande

**Alternativ kortare version (om tidsbrist):**
"Registreringen kräver plats-tillstånd och verifierar att du bor i Väsby – detta är en lokal pilot för vår kommun."

---

## 0:45 - 1:15 (Resource Discovery - The Core Utility)

**Script:**
"Grannkartan visar inte bara vem som finns nära – den visar vilka resurser och behov som finns. Här kan jag söka efter 'generator'. Appen visar att Anna har en generator 5kW och är 'Nära' – inom gångavstånd. Hon erbjuder också första hjälpen-kunskap. 

Detta är inte ett socialt medium för prat, utan en karta över konkret hjälp när krisen kommer. Vem har ved? Vem kan ge tak över huvudet? Vem har medicinsk kunskap?"

**Visa:**
1. Resources-skärmen
2. Sök "generator" eller filtrera på "Värme 🔥"
3. Se Anna's generator med fuzzy distance "Nära"
4. Klicka för att se detaljer
5. Visa att hon också har första hjälpen

---

## 1:15 - 1:40 (Privacy & Safety - Show Professional Design)

**Script:**
"Men vi har tänkt på säkerheten. Innan Anna kan kontakta någon måste hon begära tillstånd. Grannen ser bara hennes visningsnamn först – 'Anna S' – inte fullt namn eller telefonnummer. 

När förfrågan accepteras öppnas kontakten och de kan SMS:a varandra. Detta skyddar mot missbruk och stalking samtidigt som det bygger tillit steg för steg."

**Visa:**
1. NeighborDetail för Anna
2. Visa display name "Anna S" (inte fullt namn)
3. Fuzzy distance "Nära" (inte exakt meter)
4. "Begär kontakt"-knapp
5. (Optional) Visa accepterad kontakt → "Skicka SMS"

**Alternativ kortare (30 sek):**
"Av säkerhetsskäl kräver kontakt samtycke. Du ser bara visningsnamn först, och telefonnummer avslöjas bara efter godkänd förfrågan. Detta skyddar mot missbruk."

---

## 1:40 - 2:10 (Offline Mode - The Killer Feature)

**Script:**
"Men det unika med Stuga är detta. Nu stänger jag av internet – som vid ett strömavbrott."

*(Stäng av WiFi, visa offline-banner)*

"Som du ser går appen in i offline-läge. Men den fungerar fortfarande. Jag kan logga resurser, skicka Hearts som tack för hjälp, allt sparas lokalt i telefonen."

*(Lägg till en resurs eller skicka Hearts)*

"Så fort nätet kommer tillbaka – kanske bara för en minut – synkar allt automatiskt. Designat för intermittent infrastruktur. När nätet är nere periodvis fungerar Stuga ändå."

**Visa:**
1. Stäng av WiFi/Mobile data
2. Offline-banner visas: "🔡 Offline-läge"
3. Lägg till resurs ELLER skicka Hearts
4. Visa "🔦 Resurs köas (synkas vid nästa anslutning)"
5. Slå på nätet igen
6. Visa sync: "🔄 Synkroniserar 1 transaktioner..."
7. "✅ Synkat!"

---

## 2:10 - 2:30 (Hearts - Quick Mention)

**Script:**
"För att bygga kultur av ömsesidighet har vi 'Hearts' – ett tacksystem. När Sven hjälper mig snöskotta skickar jag 50 Hearts som tack. Inte pengar, bara uppskattning som stärker gemenskapen. Det skapar social skuld i positiv bemärkelse – en påminnelse om att vi hjälper varandra."

**Visa:**
1. SendHearts-skärmen
2. Välj 50 Hearts
3. Skriv "Tack för snöskottningen!"
4. Skicka

**Alternativ kortare (om tidsbrist - 15 sek):**
"Vi har också 'Hearts' – ett tack-system som bygger kultur av ömsesidighet. Inte pengar, bara uppskattning."

---

## 2:30 - 2:50 (Outro - Pilot Timeline)

**Script:**
"Jag bygger detta med modern öppen källkod och Firebase. Målet är en skarp pilot i Upplands Väsby våren 2026. Jag söker dialog med kommunen för att se hur detta kan komplettera ert befintliga krisberedskapsarbete – inte ersätta det, utan förstärka det på grannivå.

Tack för att du tittade, Francisca. Jag hoppas vi kan fortsätta diskussionen."

**Visa:**
- Tillbaka till HomeScreen
- Eller: Profil-skärm med ditt namn
- Eller: Stuga-logo

---

## Alternativ Kortversion (2 minuter exakt)

Om du behöver hålla exakt 2 minuter:

1. **Intro (20 sek)** - Problem statement
2. **Resource Discovery (35 sek)** - Sök generator, visa konkret nytta
3. **Privacy kort (25 sek)** - "Samtycke krävs för kontakt"
4. **Offline demo (30 sek)** - Stäng av, lägg till resurs, synka
5. **Outro (10 sek)** - Pilot våren 2026

**Skippa:**
- Detaljerad registration demo (nämn bara)
- Lång Hearts-förklaring (nämn bara)

---

## Recording Tips

### Setup
- **Använd:** iPhone med iOS (ser proffsigast ut)
- **Recording:** QuickTime Screen Recording på Mac
- **Account:** test@stuga.local (konsekvent testdata)
- **Ljud:** Lugn miljö, tala tydligt och långsamt

### Förberedelser
1. **Testa flödet 3 gånger** innan recording
2. **Töm notifikationer** från telefonen
3. **Sätt Do Not Disturb**
4. **Full batteriladdning** (ser bättre ut)
5. **Stäng andra appar**

### Test Data
Se till att du har:
- ✅ Anna med generator (Nära)
- ✅ Sven med verktyg (Nära)
- ✅ Maria med något (Nära)
- ✅ Minst 1 brådskande resurs för att visa urgency
- ✅ Några Hearts-transaktioner i historiken

### Ta 2-3 Takes
- **Take 1:** Warm-up, hitta flow
- **Take 2:** Main attempt
- **Take 3:** Backup

Välj den bästa!

---

## Post-Production (Optional)

Om du vill redigera:
- **iMovie** (gratis på Mac)
- Lägg till textoverlays för key points:
  - "Lokal pilot - Upplands Väsby"
  - "Offline-resiliens"
  - "Privacy by design"
- Lägg till intro-slide med Stuga-logo
- Outro med kontaktinfo

---

## Vad Denna Script Visar

**v0.6.0 script visade:**
- Grannkarta med distance
- Hearts
- Offline

**v1.1.0 script visar:**
- ✅ Geographic restriction (pilot scope)
- ✅ Resource discovery (actual utility)
- ✅ Privacy protection (professional design)
- ✅ Offline resilience (killer feature)
- ✅ Hearts (community culture)

**Impact:**
- Francisca ser att detta är **genomtänkt** (privacy)
- Francisca ser att detta är **användbart** (resource search)
- Francisca ser att detta är **resilient** (offline mode)
- Francisca ser att detta är **lokalt** (Väsby-fokuserat)

---

## Email Till Francisca (Efter Recording)

**Subject:** Stuga-demo: Grannsamverkan för krisberedskap i Upplands Väsby

**Body:**
Hej Francisca,

Som utlovat har jag spelat in en kort demo (2-3 min) av Stuga – verktyget jag utvecklar för lokal krisberedskap genom grannsamverkan.

**Videon visar:**
- Hur grannar kan hitta resurser lokalt (generator, första hjälpen, etc.)
- Hur appen fungerar även när internet ligger nere
- Hur privacy och säkerhet är inbyggt från start

**Status:**
- Teknisk prototyp färdig och testad
- Geografisk begränsning till Upplands Väsby kommun
- Redo för liten pilot våren 2026

**Nästa steg:**
Jag skulle gärna diskutera hur detta kan komplettera kommunens befintliga krisberedskapsarbete. Kanske ett kort möte i januari/februari?

Ser fram emot din feedback!

Vänligen,
[Ditt namn]

---

Vill du att jag hjälper dig att:
1. ✅ **Förbättra scriptet ytterligare?**
2. ✅ **Skapa bättre testdata för demon?**
3. ✅ **Göra en recording-checklista?**
4. ✅ **Skriva email till Francisca?**

Lycka till med inspelningen! 🎬✨
