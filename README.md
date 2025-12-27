# Stuga
## Grannsamverkan för krisberedskap / Neighborhood Coordination for Crisis Preparedness

**Status:** Early Development  
**Pilot:** Upplands Väsby kommun + Civilförsvarsförbundet Väsby  
**Platform:** Built on [CivicBase](../CivicBase)  
**Currency:** Uses Hearts from [love-ledger](../love-ledger)  

---

## Problemet / The Problem

**November 2024** visade oss vad som händer när undervattensledningar kapas: Sveriges digitala infrastruktur stannar. Swish fungerar inte. BankID fungerar inte. Kommunala system fungerar inte.

**Men grannskapet finns kvar.**

November 2024 showed us what happens when undersea cables are cut: Sweden's digital infrastructure stops. Swish doesn't work. BankID doesn't work. Municipal systems don't work.

**But the neighborhood remains.**

---

## Lösningen / The Solution

Stuga är en app som hjälper grannar att samordna resurser och ömsesidig hjälp under kriser - **och fortsätter att fungera även när internet ligger nere**.

Stuga is an app that helps neighbors coordinate resources and mutual aid during crises - **and continues to function even when the internet is down**.

### Kärnfunktioner / Core Features

**🏘️ Grannkarta (Neighborhood Map)**
- Visa grannar inom 500m som också använder Stuga
- Vilka resurser de kan dela (mat, verktyg, kunskap)
- Fungerar via Bluetooth när internet är nere

**🤝 Resursdelning (Resource Sharing)**
- "Jag behöver: såg, värme, mat, hjälp med..."
- "Jag kan erbjuda: generator, ved, matlagning, första hjälpen..."
- Enkel matchning mellan behov och tillgångar

**💖 Hearts-valuta (Hearts Currency)**
- Spåra ömsesidig hjälp med Hearts från love-ledger
- "Du hjälpte mig snöskotta → +50 Hearts"
- Bygger kultur av ömsesidighet som fortsätter efter krisen

**📡 Offline-kapabel (Offline Capable)**
- Mesh-nätverk via Bluetooth/Wi-Fi Direct
- Synkroniserar när internet återvänder
- Fungerar i 72+ timmar utan anslutning

**🛡️ Integrerad med FRG (Integrated with FRG)**
- Koppling till Frivilliga resursgrupper
- Civilförsvarsförbundets strukturer
- Kommunal krisberedskapsplan

---

## Teknisk Grund / Technical Foundation

### Bygger på CivicBase-plattformen

Stuga är **inte** en fristående app - det är en applikation byggd på [CivicBase](../CivicBase) infrastruktur:

**CivicBase tillhandahåller:**
- Offline-först P2P-nätverk (libp2p)
- Agent-centrisk datamodell
- End-to-end kryptering (AES-256-GCM)
- Mesh-nätverk backup
- GDPR-efterlevnad by design

**Stuga tillför:**
- Grannsamverkans-specifik logik
- Resursdelning UI
- Hearts-integration från love-ledger
- FRG/Civilförsvarsförbundet koppling
- Svensk totalförsvarsfokus

### Relation till love-ledger

Stuga använder **Hearts-valutan** från [love-ledger](../love-ledger) projektet:

**love-ledger:** Global vårdekonomisk vision  
**Stuga:** Svensk krisberedskapsimplementation

Hearts i Stuga spårar ömsesidig hjälp under kriser:
- Granne hjälper med snöskottning → +30 Hearts
- Delar generator med grannfamilj → +80 Hearts
- Lagar mat åt äldre grannar → +50 Hearts

**Skillnad från love-ledger:**
- Ingen AUBI-integration (inga kronor, bara Hearts)
- Ingen Leaves (ekologiska NFTs)
- Ingen Community Weaver-validering (enkel peer-godkännande)
- Fokus på krisscenarier, inte vardaglig vårdekopi

**Framtida koppling:**
När love-ledger implementeras i Sverige kan Stuga-Hearts integreras i det större vårdekonomi-systemet. Men för MVPn: Stuga är fristående krisberedskap.

---

## Målgrupper / Target Audiences

### Primär: Grannskapsgrupper (Primary: Neighborhood Groups)

**Väsby-piloter:**
- Bostadsområden i Upplands Väsby
- Villaområden med aktiva Hemvärnsmedlemmar
- Föreningsaktiva grannskapsgrupper

**Profil:**
- 35-65 år (men designat för 7-90 år)
- Bor i villa/radhus med trädgård
- Har generator, ved, eller andra resurser
- Vill förbereda sitt grannskap

### Sekundär: Civilförsvarsförbundet (Secondary: Civil Defense Association)

**Organisationer:**
- Lokalavdelning Upplands Väsby
- FRG-grupper (Frivilliga resursgrupper)
- Hemvärnet

**Användning:**
- Koordinera medlemmar under övningar
- Testa mesh-nätverk kapacitet
- Koppla till kommunal beredskapsplan

### Tertiär: Kommunal Beredskap (Tertiary: Municipal Preparedness)

**Användare:**
- Beredskapsamordnare
- Räddningstjänst
- Socialtjänst (äldrevård, hemtjänst)

**Användning:**
- Kartlägga grannsamverkan kapacitet
- Komplement till officiella system
- Backup vid IT-avbrott

---

## Status & Färdplan / Status & Roadmap

### Nuvarande Status (December 2025)

**✅ Teknisk Grund:**
- CivicBase-plattformen utvecklad (proof-of-concept)
- Offline P2P-nätverk fungerar
- Hearts-koncept definierat

**🔄 Pågående:**
- Dialoger med Upplands Väsby kommun
- Partnership-diskussioner med Civilförsvarsförbundet
- UI/UX-design för Stuga-specifik funktionalitet

**⏳ Väntande:**
- Institutionellt stöd från Väsby
- Vinnova-finansiering för CivicBase (2.5M SEK)
- MCF pilotfinansiering

### Fas 1: MVP (Q1-Q2 2026)

**Om finansiering säkras:**

**Sprint 1-4 (3 månader):**
- [ ] Grannkarta-funktion (Bluetooth-upptäckt)
- [ ] Resursdelning (behov + erbjudanden)
- [ ] Hearts-integration (enkel spårning)
- [ ] Offline-läge (mesh-nätverk)
- [ ] Svenska + Engelsk UI

**Sprint 5-6 (6 veckor):**
- [ ] Pilottest med 20-30 grannar i Väsby
- [ ] Civilförsvarsförbundet-integration
- [ ] Feedback-iteration
- [ ] Offline-scenariotest (72-timmar)

**Framgångskriterier:**
- App fungerar offline i 72+ timmar
- Grannar kan dela resurser via Bluetooth-mesh
- Hearts spårar ömsesidig hjälp
- Användare upplever systemet som användbart

### Fas 2: Skalning (Q3-Q4 2026)

**Sprint 7-12 (6 månader):**
- [ ] Expansion till 100-200 användare (flera grannskap)
- [ ] FRG-grupp integration
- [ ] Kommunal beredskapsplan-koppling
- [ ] Native mobilapp (iOS/Android)
- [ ] Onboarding-material på svenska

### Fas 3: Regional (2027)

- [ ] Expansion till andra kommuner
- [ ] Integration med MCF totalförsvarssystem
- [ ] Eventuell koppling till love-ledger (om implementerat)

---

## Varför Stuga, inte bara CivicBase? / Why Stuga, not just CivicBase?

**CivicBase** = Infrastrukturplattform (som libp2p, SQLite)  
**Stuga** = Grannsamverkansapplikation (som Swish, men för ömsesidig hjälp)

**Analogier:**

| Infrastruktur | Applikation |
|---------------|-------------|
| Internet | Gmail |
| Telefonnät | Swish |
| CivicBase | Stuga |

**CivicBase kan användas för många applikationer:**
- TAK-405 (kollektivtrafikvälfärd)
- DPOP (politisk organisering)
- DiDiS (digital identitet)
- **Stuga (grannsamverkan)**

**Stuga fokuserar på:**
- Grannskap (inte hela kommunen)
- Krisberedskap (inte vardaglig vård)
- Svensk totalförsvar (inte global vårdekopi)
- Praktisk resursdelning (inte filosofisk transformation)

---

## Tekniska Detaljer / Technical Details

### Arkitektur

```
┌─────────────────────────────────────┐
│ Stuga App (React Native)            │
│ - Grannkarta UI                     │
│ - Resursdelning                     │
│ - Hearts-integration                │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ CivicBase Platform                  │
│ - libp2p P2P-nätverk                │
│ - SQLite lokal databas              │
│ - Offline-synkronisering            │
│ - Mesh-nätverk (Bluetooth/WiFi)     │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ love-ledger (Hearts Logic)          │
│ - Hearts-skapande                   │
│ - Transaktionslogik                 │
│ - Ömsesidighetsspårning            │
└─────────────────────────────────────┘
```

### Data Model (Förenklad)

**Granne (Neighbor):**
```typescript
{
  id: string,
  name: string,
  location: {lat: number, lon: number},
  distance: number, // meters
  resources_offered: string[],
  resources_needed: string[],
  hearts_balance: number,
  last_seen: timestamp,
  bluetooth_address: string // för mesh
}
```

**Resursdelning (Resource Exchange):**
```typescript
{
  id: string,
  type: 'need' | 'offer',
  category: 'mat' | 'verktyg' | 'kunskap' | 'värme' | 'transport' | 'annat',
  description: string,
  from_neighbor: string,
  to_neighbor: string | null, // null = öppen förfrågan
  hearts_value: number | null, // tilldelat efter transaktion
  status: 'open' | 'matched' | 'completed',
  offline_sync_status: 'synced' | 'pending'
}
```

**Hearts-transaktion:**
```typescript
{
  id: string,
  from: string,
  to: string,
  amount: number,
  reason: string,
  timestamp: timestamp,
  confirmed_by_recipient: boolean,
  offline_created: boolean // skapad offline, synkad senare
}
```

### Offline-kapabilitet

**Scenario: 72-timmars internetavbrott**

**Dag 1 (0-24h):**
- App fortsätter fungera via Bluetooth-mesh
- Grannar inom 50m kan kommunicera direkt
- Grannar 50-500m når varandra via mesh-hopp
- Hearts-transaktioner skapas lokalt

**Dag 2 (24-48h):**
- Data synkroniseras mellan grannar via mesh
- Konflikter löses (vector clocks + last-write-wins)
- Grannkarta uppdateras när enheter möts

**Dag 3 (48-72h):**
- System fortsätter fungera
- Tombstone-märkning för raderade poster
- Eventual consistency när internet återvänder

**Internet återvänder:**
- Automatisk synkronisering till CivicBase
- Konfliktlösning (låt lokal data vinna vid kris)
- Validering av Hearts-transaktioner

---

## Säkerhet & Integritet / Security & Privacy

### GDPR-efterlevnad

**Agent-centrisk data:**
- Varje användare äger sin data (SQLite på enhet)
- Ingen central databas att hacka
- Rätt att bli glömd: radera appen = radera data

**Vad delas med grannar:**
- Namn, ungefärlig plats (500m-radie)
- Resurser erbjudna/efterfrågade
- Hearts-transaktioner (bara mellan parter)

**Vad delas INTE:**
- Exakt hemadress (bara Bluetooth-räckvidd)
- Personligt personnummer
- Finansiell data
- Kommunikation utanför app

### Säkerhet

**Kryptering:**
- End-to-end: AES-256-GCM
- Signaturer: Ed25519
- Mesh-kommunikation: TLS 1.3

**Identitet:**
- BankID-validering vid onboarding (förhindrar sybil-attacker)
- Lokalt lagrad identitetsnyckel
- Ingen central ID-databas

**Attacker vi skyddar mot:**
- Man-in-the-middle: E2E-kryptering
- Sybil-attacker: BankID-verifiering
- Data breach: Ingen central databas
- GPS-tracking: Bara ungefärlig plats delad

---

## Användningsfall / Use Cases

### Scenario 1: Vinterström (Winter Power Outage)

**Situation:**
- Snöoväder slår ut el i Väsby (faktiskt hände januari 2024)
- Internet fungerar inte
- Telefonnät överbelastat
- Värme behövs

**Stuga-användning:**
1. Anna öppnar app (fungerar offline via Bluetooth)
2. Ser att Sven 200m bort har generator
3. Skickar begäran: "Kan vi dela värme? +50 Hearts"
4. Sven accepterar via Bluetooth-mesh
5. Annas familj går till Svens hus
6. Efter krisen: Hearts registreras, ömsesidighet förstärks

### Scenario 2: Livsmedelsbrist (Food Shortage)

**Situation:**
- Hamn blockad → butiker tomma (hypotetisk)
- Internet fungerar sporadiskt
- Grannar har olika resurser

**Stuga-användning:**
1. Erik har för mycket potatis från trädgården
2. Postar erbjudande: "10kg potatis, gratis (eller +30 Hearts)"
3. Maria behöver mat för familj
4. Matchar via Bluetooth när de är inom räckvidd
5. Utbyte sker, Hearts tilldelas
6. Nätverk av ömsesidighet växer

### Scenario 3: FRG-övning (FRG Exercise)

**Situation:**
- Civilförsvarsförbundet testar beredskap
- Simulerad 48-timmars IT-avbrott
- 30 medlemmar deltar

**Stuga-användning:**
1. FRG-koordinator skapar "övnings-läge"
2. Medlemmar testar mesh-nätverk
3. Resursdelning simuleras
4. Hearts spårar "transaktioner"
5. Efter övning: rapport om vad fungerade
6. Feedback till CivicBase-utveckling

---

## Konkurrensanalys / Competitive Analysis

**Varför inte bara använda...**

### Facebook-grupper?
- ❌ Kräver internet
- ❌ Ingen offline-kapabilitet
- ❌ Ingen resursdelnings-struktur
- ❌ Ingen Hearts-spårning
- ✅ Stuga: Fungerar offline, strukturerad resursdelning

### WhatsApp/Signal?
- ❌ Kräver telefonnät eller internet
- ❌ Ingen geografisk matchning
- ❌ Ingen systematisk resursdelning
- ✅ Stuga: Bluetooth-mesh, grannkarta, strukturerade resurser

### Zello (walkie-talkie app)?
- ❌ Bara röstsamtal
- ❌ Ingen resursdelning
- ❌ Ingen ömsesidighetsspårning
- ✅ Stuga: Text + röst + resursstruktur + Hearts

### Klassisk granntavla?
- ✅ Fungerar utan el!
- ❌ Ingen digital sökning
- ❌ Ingen ömsesidighetsspårning
- ❌ Begränsad till ett område
- ⚖️ Komplement: Stuga digitaliserar tavlan, backup är analog

**Stugas unika värde:**
- Offline-först design
- Bluetooth-mesh (verkligen fungerar utan internet)
- Hearts ömsesidighetsspårning
- Totalförsvarsinriktad
- CivicBase infrastruktur (beprövad P2P-teknik)

---

## Bidra / Contributing

**Vi söker:**

### Pilotanvändare (Upplands Väsby)
- Grannskapsgrupper villiga att testa
- FRG-medlemmar från Civilförsvarsförbundet
- Tekniskt intresserade early adopters

**Kontakt:** bjorn.kenneth.holmstrom@gmail.com

### Utvecklare
- React Native-utvecklare (mobilapp)
- P2P-nätverk expert (mesh-optimering)
- UI/UX-designer (användarvänlighet för 7-90 år)

**Se:** [CivicBase CONTRIBUTING.md](../CivicBase/CONTRIBUTING.md)

### Institutionella Partners
- Upplands Väsby kommun (referenskommun)
- Civilförsvarsförbundet lokalavdelningar
- Andra kommuner intresserade av pilot

**Kontakt:** bjorn.kenneth.holmstrom@gmail.com

---

## Finansiering / Funding

### Nuvarande Status

**Stuga ingår i CivicBase-grant:**
- Vinnova-ansökan: 2.5M SEK (12 månader)
- MCF pilotfinansiering: Under diskussion
- Status: Väntande institutionellt stöd från Väsby

**Budget för Stuga-utveckling:**
- ~400K SEK av total CivicBase-budget
- 2 månader utvecklartid (ur 12-månadersperiod)
- Pilottest med 50-100 användare

### Framtida Finansiering

**Om piloten lyckas:**
- Expansion till andra kommuner
- MCF stöd för FRG-integration
- Eventuell EU Digital Sovereignty funding

---

## Licens / License

**AGPL-3.0**

Varför AGPL?
- Säkerställer att förbättringar delas mellan kommuner
- Förhindrar vendor lock-in
- Möjliggör konkurrenskraftig supportmarknad
- Överensstämmer med public infrastructure-uppdraget

Se [LICENSE](../CivicBase/LICENSE) i CivicBase-repository.

---

## Kontakt / Contact

**Projektledare:**  
Björn Kenneth Holmström  
Lead Architect, Global Governance Frameworks  
bjorn.kenneth.holmstrom@gmail.com

**Organisation:**  
Global Governance Frameworks (forskningsinitiativ)  
https://github.com/GlobalGovernanceFrameworks

**Relaterade Projekt:**
- [CivicBase](../CivicBase) - Plattformen Stuga bygger på
- [love-ledger](../love-ledger) - Hearts-valutans ursprung

---

## Vanliga Frågor / FAQ

**Q: Fungerar Stuga verkligen utan internet?**  
A: Ja, via Bluetooth Low Energy mesh-nätverk. Grannar inom 50m kommunicerar direkt, grannar 50-500m via mesh-hopp. Synkronisering sker när internet återvänder.

**Q: Behöver jag BankID?**  
A: Ja, för onboarding (förhindrar falska konton). Men efter det fungerar appen utan BankID.

**Q: Kostar Hearts kronor?**  
A: Nej. Hearts är ömsesidighetsspårning, inte pengar. Ingen koppling till bankkonto (för MVPn).

**Q: Vad händer om någon missbrukar systemet?**  
A: Peer-validering + BankID-verifiering förhindrar de flesta missbruk. Lokalsamhället ser vem som hjälper och vem som bara tar.

**Q: Kan Stuga integreras med FRG?**  
A: Ja, det är målet. Civilförsvarsförbundet Väsby är pilot-partner.

**Q: Är detta relaterat till Fjärilspartiet?**  
A: Björn Holmström är grundare av båda. Fjärilspartiet förespråkar policy för denna typ av infrastruktur (STR-506), men Stuga/CivicBase är oberoende forskningsprojekt.

**Q: Hur skiljer sig Stuga från love-ledger?**  
A: love-ledger är global vårdekonomivision med AUBI-integration. Stuga är svensk krisberedskapsimplementation. Delar Hearts-koncept, men olika scope.

---

**Stuga.** Grannskap som fungerar när allt annat slutar fungera. 🏘️

*Byggd på CivicBase-plattformen. Använder Hearts från love-ledger. Utvecklad som del av Global Governance Frameworks forskningsinitiativ.*

*Nästa steg: Säkra institutionellt stöd från Upplands Väsby kommun och Civilförsvarsförbundet för pilotstart Q2 2026.*
