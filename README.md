# Stuga
## Grannsamverkan för krisberedskap / Neighborhood Coordination for Crisis Preparedness

**Status:** MVP Development (Firebase-based)  
**Pilot:** Upplands Väsby kommun + Civilförsvarsförbundet Väsby  
**Current Platform:** Firebase (MVP) → CivicBase (Production, late 2026)  
**Currency:** Uses Hearts concept from [love-ledger](../love-ledger)  
**Timeline:** MVP pilot Q2 2026, CivicBase migration Q4 2026

---

## 🚨 Important: Two-Phase Development Strategy

**Why two phases?**

Stuga's long-term vision requires robust P2P mesh networking (CivicBase), but Upplands Väsby needs a pilot by **April 2026**. Building production-grade CivicBase takes 12 months with expert help (starting August 2026 when consultant is hired).

**Solution:** Build working MVP first, migrate to production infrastructure later.

### Phase 1: MVP (Firebase) - Jan-Jun 2026

**Goal:** Validate Stuga concept with real users  
**Stack:** React Native + Firebase + Basic Bluetooth  
**Users:** 20-50 pilot users in Väsby  
**Features:** Core functionality, "good enough" offline support  

### Phase 2: Production (CivicBase) - Aug 2026-2027

**Goal:** Production-grade P2P mesh infrastructure  
**Stack:** React Native + CivicBase + Full libp2p mesh  
**Users:** 100+ users, multiple municipalities  
**Features:** True offline mesh, advanced crypto, full sovereignty  

**This document describes BOTH phases clearly.**

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
- MVP: Firebase location sync | Production: P2P Bluetooth mesh

**🤝 Resursdelning (Resource Sharing)**
- "Jag behöver: såg, värme, mat, hjälp med..."
- "Jag kan erbjuda: generator, ved, matlagning, första hjälpen..."
- Enkel matchning mellan behov och tillgångar

**💖 Hearts-valuta (Hearts Currency)**
- Spåra ömsesidig hjälp med Hearts från love-ledger-konceptet
- "Du hjälpte mig snöskotta → +50 Hearts"
- Bygger kultur av ömsesidighet som fortsätter efter krisen

**📡 Offline-kapabel (Offline Capable)**
- MVP: Firebase offline persistence (delayed sync when connection returns)
- Production: True mesh-nätverk via Bluetooth/Wi-Fi Direct
- Fungerar i 72+ timmar utan anslutning

**🛡️ Integrerad med FRG (Integrated with FRG)**
- Koppling till Frivilliga resursgrupper
- Civilförsvarsförbundets strukturer
- Kommunal krisberedskapsplan

---

## Teknisk Grund / Technical Foundation

### MVP Architecture (Phase 1: Jan-Jun 2026)

**Frontend:**
- React Native (Expo framework)
- Cross-platform iOS/Android from single codebase
- AI-assisted development (Claude, Gemini for implementation)

**Backend:**
- **Firebase Firestore** (real-time database with offline support)
- **Firebase Auth** (with BankID integration)
- **Firebase Functions** (serverless backend logic)
- **SQLite** (local cache for offline data)

**Offline Support:**
- Firestore offline persistence (built-in)
- Queue transactions for later sync
- Basic Bluetooth neighbor discovery (react-native-ble-plx)

**Why Firebase for MVP?**
- ✅ 2-3 month development time (realistic for pilot deadline)
- ✅ Proven offline support (works well enough for validation)
- ✅ BankID integration available
- ✅ Free for pilot scale (<50 users)
- ✅ AI assistants (Claude) excel at Firebase development
- ✅ Focus on UX/validation, not infrastructure complexity

**Limitations acknowledged:**
- ⚠️ Not true P2P mesh (delayed sync to central server)
- ⚠️ Data stored on Google servers (not sovereign)
- ⚠️ Requires eventual internet connection for sync
- ⚠️ Limited Bluetooth range (direct connections only)

**Why this is OK for pilot:**
- Validates Hearts concept
- Tests resource matching UX
- Gathers user requirements
- Proves municipal interest
- Informs CivicBase development

### Production Architecture (Phase 2: Aug 2026-2027)

**Migration to CivicBase platform:**

**CivicBase will provide:**
- Offline-först P2P-nätverk (libp2p)
- Agent-centrisk datamodell
- End-to-end kryptering (AES-256-GCM)
- True mesh-nätverk (multi-hop Bluetooth/Wi-Fi)
- GDPR-efterlevnad by design
- No central servers (true data sovereignty)

**Stuga will add:**
- Grannsamverkans-specifik logik (reused from MVP)
- Resursdelning UI (same React Native components)
- Hearts-integration (refined based on pilot feedback)
- FRG/Civilförsvarsförbundet koppling

**Migration plan:**
```
Q3 2026: CivicBase mesh ready (consultant builds)
Q4 2026: Stuga backend migration begins
  - Keep React Native UI (100% reusable)
  - Swap Firebase → CivicBase backend
  - Progressive rollout (beta → full)
Q1 2027: Full CivicBase deployment
  - All users migrated
  - Firebase deprecated
  - True P2P mesh operational
```

**User experience during migration:**
- Gradual improvements (better offline, longer range)
- No disruptive "everything changes" moment
- Data preserved and migrated
- "Stuga just got better!"

### Relation to love-ledger

Stuga uses the **Hearts currency concept** from [love-ledger](../love-ledger) project:

**love-ledger:** Global care economy vision with AUBI, Leaves NFTs, complex validation  
**Stuga:** Swedish crisis-focused implementation with simplified Hearts

Hearts in Stuga track mutual aid during crises:
- Granne hjälper med snöskottning → +30 Hearts
- Delar generator med grannfamilj → +80 Hearts
- Lagar mat åt äldre grannar → +50 Hearts

**Differences from love-ledger:**
- No AUBI-integration (no fiat currency, Hearts only)
- No Leaves (ecological NFTs)
- No Community Weaver-validation (simple peer confirmation)
- Focus on crisis scenarios, not everyday care economy

**Future connection:**
If/when love-ledger is implemented in Sweden, Stuga Hearts could integrate with the larger care economy system. But for MVP: Stuga is standalone crisis preparedness.

---

## Målgrupper / Target Audiences

### Primär: Grannskapsgrupper (Primary: Neighborhood Groups)

**Väsby-pilot:**
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
- Testa offline-kapacitet (först Firebase, sen CivicBase mesh)
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

**✅ Planering:**
- MVP architecture defined (Firebase-based)
- UI/UX specifications complete
- Technical specifications documented
- AI-assisted development approach planned

**🔄 Pågående:**
- Dialoger med Upplands Väsby kommun (waiting for beredskapsamordnare contact)
- Partnership-diskussioner med Civilförsvarsförbundet Väsby (waiting for response)
- Preparing meeting materials (one-pager, presentation)

**⏳ Väntande:**
- Institutionellt stöd från Väsby
- Vinnova-finansiering för CivicBase (2.5M SEK, 12 månader)
- MCF pilot-financing discussion

### Phase 1: MVP Development (Q1-Q2 2026)

**Month 1 (January 2026) - Planning & Setup**
- [ ] Väsby confirms interest
- [ ] Firebase project setup
- [ ] React Native Expo initialization
- [ ] BankID test environment
- [ ] AI development workflow (Claude/Gemini for coding)

**Month 2 (February 2026) - Core Features**
- [ ] Firebase Firestore schema (users, resources, hearts)
- [ ] React Native UI (grannkarta, resource posting)
- [ ] Hearts transactions (basic send/receive)
- [ ] Offline persistence (Firestore + SQLite)
- [ ] BankID authentication flow

**Month 3 (March 2026) - Polish & Testing**
- [ ] Basic Bluetooth neighbor discovery
- [ ] Swedish translations complete
- [ ] Accessibility improvements (WCAG 2.1 AA)
- [ ] Beta testing with 5-10 users
- [ ] Bug fixes and UX refinements

**Month 4-6 (April-June 2026) - Pilot Running**
- [ ] Recruit 20-50 Väsby users
- [ ] Onboarding and support
- [ ] Monitor usage and gather feedback
- [ ] Document learnings for CivicBase requirements
- [ ] Evaluation report for municipality

**Pilot Success Criteria:**
- 30+ active users
- Offline capability demonstrated (72-hour test)
- Hearts transactions functional
- Positive user feedback (>70% satisfaction)
- Municipality endorsement for continued development

### Phase 2: CivicBase Migration (Q3-Q4 2026)

**If Vinnova grant approved:**

**August 2026: Distributed Systems Consultant Hired**
- Expert begins CivicBase production development
- User requirements from Stuga pilot inform architecture
- Parallel development (Stuga keeps running on Firebase)

**September-November 2026: CivicBase Core Built**
- libp2p mesh networking
- Agent-centric database
- End-to-end encryption
- BankID integration
- Offline sync protocol

**December 2026: Migration Preparation**
- CivicBase SDK for React Native
- Migration testing with beta users (5-10)
- Data migration scripts
- Rollback plan if issues

**Q1 2027: Progressive Migration**
- 10% rollout → monitoring
- 25% rollout → feedback
- 50% rollout → optimization
- 100% rollout → complete
- Firebase sunset

**Migration Success Criteria:**
- No data loss
- Better offline capability (multi-hop mesh)
- Improved user experience
- GDPR compliance validated
- Security audit passed

### Phase 3: Scale (2027+)

**If pilot successful:**
- [ ] Expansion to other Swedish municipalities
- [ ] Integration with MCF totalförsvar systems
- [ ] Native mobile apps (not just Expo)
- [ ] Advanced FRG coordination features
- [ ] Possible love-ledger integration (if implemented)

---

## Varför Stuga, inte bara CivicBase? / Why Stuga, not just CivicBase?

**CivicBase** = Infrastructure platform (like libp2p, SQLite)  
**Stuga** = Crisis coordination application (like Swish, but for mutual aid)

**Analogier:**

| Infrastructure | Application |
|----------------|-------------|
| Internet | Gmail |
| Telefonnät | Swish |
| CivicBase | Stuga |

**CivicBase can power many applications:**
- TAK-405 (kollektivtrafikvälfärd)
- DPOP (politisk organisering)
- DiDiS (digital identitet)
- **Stuga (grannsamverkan)** ← Our first application

**Stuga focuses on:**
- Grannskap (not whole municipality)
- Krisberedskap (not everyday coordination)
- Svensk totalförsvar (not global systems)
- Practical resource sharing (not philosophical transformation)

**Development phasing:**
- Phase 1: Prove Stuga concept works (Firebase MVP)
- Phase 2: Build robust infrastructure (CivicBase)
- Phase 3: Stuga runs on CivicBase + expand to new applications

---

## Tekniska Detaljer / Technical Details

### MVP Architecture (Firebase-Based)

```
┌─────────────────────────────────────┐
│ Stuga App (React Native + Expo)    │
│ - Grannkarta UI                     │
│ - Resursdelning                     │
│ - Hearts-integration                │
│ - Expo managed workflow             │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ Firebase Backend                    │
│ - Firestore (real-time database)    │
│ - Auth (BankID integration)         │
│ - Functions (serverless backend)    │
│ - Storage (profile images)          │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ Local Storage                       │
│ - SQLite (offline cache)            │
│ - Firestore offline persistence     │
│ - AsyncStorage (user preferences)   │
└─────────────────────────────────────┘
```

### Production Architecture (CivicBase)

```
┌─────────────────────────────────────┐
│ Stuga App (React Native - Same!)   │
│ - Grannkarta UI (reused)            │
│ - Resursdelning (reused)            │
│ - Hearts-integration (reused)       │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ CivicBase Platform                  │
│ - libp2p P2P-nätverk                │
│ - SQLite agent-centric DB           │
│ - Offline-synkronisering (mesh)     │
│ - End-to-end encryption             │
│ - No central servers                │
└─────────────────────────────────────┘
```

**What stays the same:** React Native UI (100% reusable)  
**What changes:** Backend layer (Firebase → CivicBase)

### Data Model (Same for Both Phases)

**Granne (Neighbor):**
```typescript
{
  id: string,
  name: string,
  bankid_verified: boolean,
  location: {lat: number, lon: number},
  resources_offered: string[],
  resources_needed: string[],
  hearts_balance: number,
  availability_status: 'available' | 'away' | 'emergency'
}
```

**Resursdelning (Resource):**
```typescript
{
  id: string,
  user_id: string,
  type: 'offer' | 'need',
  category: 'mat' | 'värme' | 'verktyg' | ...,
  description: string,
  status: 'open' | 'matched' | 'completed',
  hearts_value: number | null
}
```

**Hearts Transaction:**
```typescript
{
  id: string,
  from_user: string,
  to_user: string,
  amount: number,
  reason: string,
  confirmed_by_receiver: boolean,
  timestamp: timestamp
}
```

### Offline Capability

**MVP (Firebase):**
- Firestore offline persistence (built-in, ~10MB cache)
- Queued transactions sync when connection returns
- SQLite for larger local storage
- Works for 24-48 hours offline (depends on cache size)

**Production (CivicBase):**
- True P2P mesh (no server needed)
- Multi-hop Bluetooth/Wi-Fi Direct
- Unlimited offline duration (72+ hours easily)
- Data syncs peer-to-peer when devices in range

---

## Säkerhet & Integritet / Security & Privacy

### MVP (Firebase)

**Data Location:**
- Stored on Google Cloud servers (Europe region)
- Subject to GDPR (Google is compliant)
- Not sovereign (controlled by Google)

**Encryption:**
- TLS in transit
- AES-256 at rest (Google manages keys)
- End-to-end only for some data types

**Authentication:**
- BankID (Swedish national identity)
- Firebase Auth integration
- Prevents sybil attacks

**Privacy:**
- Location rounded to ~50m
- Exact address not shared
- Hearts balances visible to neighbors

**Acknowledged limitations:**
- Data on US company servers (not ideal for totalförsvar)
- Google could theoretically access data
- Requires trust in Firebase service

**Why acceptable for pilot:**
- Standard practice for most Swedish apps
- Focus is validating concept, not perfect sovereignty
- Will migrate to sovereign solution (CivicBase) later

### Production (CivicBase)

**Data Sovereignty:**
- Agent-centric (each user owns their data)
- Stored locally on user's device
- No central database to hack or subpoena

**Encryption:**
- End-to-end: AES-256-GCM
- Perfect forward secrecy
- User controls keys

**Authentication:**
- BankID (same as MVP)
- Local identity storage
- No central identity database

**Privacy:**
- Location approximation (user-controlled precision)
- Mesh communication encrypted
- No tracking by central authority

**Totalförsvar-aligned:**
- ✅ Works without internet (true offline)
- ✅ No foreign cloud dependencies
- ✅ Data stays in Sweden
- ✅ Resilient to infrastructure attacks

---

## Användningsfall / Use Cases

### Scenario 1: Vinterström (Winter Power Outage)

**MVP behavior:**
- Anna opens app (works from local cache)
- Sees neighbors last synced 2 hours ago
- Posts "Behöver värme" (queued for sync)
- Walks to Sven's house (remembered from map)
- When power returns: transaction syncs

**Production behavior:**
- Anna opens app (mesh network active via Bluetooth)
- Sees Sven 200m away via mesh (real-time)
- Sends request via Bluetooth mesh (no internet needed)
- Sven gets notification immediately
- Hearts transaction recorded locally, syncs via mesh

### Scenario 2: Livsmedelsbrist (Food Shortage)

**Both MVP and Production:**
- Erik posts "10kg potatis, +30 Hearts"
- Maria matches (offline or online)
- Exchange happens in person
- Hearts transferred after confirmation
- Mutual aid culture strengthened

### Scenario 3: FRG-övning (FRG Exercise)

**MVP (limited):**
- Simulated internet outage (airplane mode)
- Users work from cached data
- Record actions offline
- Sync when "internet returns" (end of exercise)

**Production (full capability):**
- True mesh network via Bluetooth
- No internet needed at all
- Real-time coordination across neighborhood
- Proves 72-hour resilience capability

---

## Konkurrensanalys / Competitive Analysis

**Varför inte bara använda...**

### Facebook-grupper?
- ❌ Kräver internet (alltid)
- ❌ Ingen offline-kapabilitet alls
- ❌ Ingen strukturerad resursdelning
- ✅ Stuga: Works offline (MVP: limited, Production: fully)

### WhatsApp/Signal?
- ❌ Kräver telefonnät eller internet
- ❌ Ingen geografisk matchning
- ❌ Ingen systematisk resursdelning
- ✅ Stuga: Neighbor map + structured resources

### Existing crisis apps?
- ⚠️ Most require central servers
- ⚠️ Proprietary/closed source
- ⚠️ No mutual aid tracking (Hearts)
- ✅ Stuga: Open source + Hearts economy

**Stugas unika värde:**
- Crisis-focused design
- Offline-capable (MVP: good enough, Production: excellent)
- Hearts mutual aid tracking
- Totalförsvar-aligned
- Open source (AGPL-3.0)
- Progressive enhancement (MVP → Production)

---

## AI-Assisted Development Strategy

**Development approach:**
- **Claude/Gemini** handle implementation (React Native + Firebase code)
- **Björn** provides requirements, architecture decisions, user research
- **Iterative refinement** via AI pair programming

**Why this works:**
- ✅ AI assistants excel at React Native + Firebase
- ✅ Björn focuses on vision, strategy, user needs
- ✅ Fast iteration (AI writes code, Björn reviews)
- ✅ Good use of recovery time (meaningful but not overwhelming)

**Development workflow:**
```
1. Björn: Define feature requirement
2. Claude: Implement React Native component
3. Björn: Test and provide feedback
4. Claude: Refine based on feedback
5. Repeat until feature complete
```

**Benefits:**
- Realistic 2-3 month timeline
- Focus on UX/product, not syntax
- Learn by reviewing code, not writing from scratch
- Sustainable pace during recovery period

---

## Bidra / Contributing

**Vi söker:**

### Pilotanvändare (Upplands Väsby)
- Grannskapsgrupper villiga att testa
- FRG-medlemmar från Civilförsvarsförbundet
- Tekniskt intresserade early adopters

**Kontakt:** bjorn.kenneth.holmstrom@gmail.com

### Utvecklare (Optional - After Pilot Success)
- React Native-utvecklare (if scaling beyond AI-assisted approach)
- P2P-nätverk expert (for CivicBase migration support)
- UI/UX-designer (polish and accessibility)

### Institutionella Partners
- Upplands Väsby kommun (reference municipality)
- Civilförsvarsförbundet lokalavdelningar
- Andra kommuner intresserade av pilot

**Kontakt:** bjorn.kenneth.holmstrom@gmail.com

---

## Finansiering / Funding

### MVP Pilot (Phase 1: Jan-Jun 2026)

**Current status:** Self-funded during recovery period

**Costs:**
- Development: 0 kr (AI-assisted, own time during sick leave)
- Firebase: 0 kr (free tier covers <50 users)
- Testing devices: Personal phones
- **Total: ~0 kr**

### Production Development (Phase 2: Aug 2026+)

**Vinnova-ansökan: 2.5M SEK (12 månader)**
- 800K SEK: Distributed Systems Consultant (CivicBase development)
- 400K SEK: Stuga-specific features + migration
- 300K SEK: Security audit + penetration testing
- 200K SEK: Pilotexpansion (100+ användare)
- 800K SEK: Overhead, administration, documentation

**Status:** Application on hold pending:
- Väsby institutional backing (beredskapsamordnare confirmation)
- Civilförsvarsförbundet partnership
- Pilot results from Phase 1

**Backup funding:**
- MCF totalförsvar pilot (exploratory)
- Region Stockholm (TAK-405 connection)
- EU Digital Sovereignty programs

### Framtida Finansiering

**If pilot succeeds:**
- Expansion to other municipalities
- MCF support for FRG-integration
- Possible EU funding for cross-border coordination

---

## Licens / License

**AGPL-3.0**

Varför AGPL?
- Säkerställer att förbättringar delas mellan kommuner
- Förhindrar vendor lock-in
- Möjliggör konkurrensmässig supportmarknad
- Överensstämmer med public infrastructure-uppdraget

**Applies to:**
- ✅ MVP (Firebase-based)
- ✅ Production (CivicBase-based)
- ✅ All Stuga code regardless of backend

Se LICENSE i repository.

---

## Kontakt / Contact

**Projektledare:**  
Björn Kenneth Holmström  
Lead Architect, Global Governance Frameworks  
bjorn.kenneth.holmstrom@gmail.com

**Organisation:**  
Global Governance Frameworks (research initiative)  
https://github.com/GlobalGovernanceFrameworks

**Relaterade Projekt:**
- [CivicBase](../CivicBase) - Platform Stuga will migrate to (Production)
- [love-ledger](../love-ledger) - Hearts currency inspiration

---

## Vanliga Frågor / FAQ

**Q: Varför Firebase först, sedan CivicBase?**  
A: Timeline. Väsby needs pilot April 2026. CivicBase takes 12 months to build properly (requires distributed systems expert, starting August 2026). Firebase gets us to pilot in 3 months, then we upgrade infrastructure when ready.

**Q: Är Firebase-versionen "riktig" offline-kapabel?**  
A: Delvis. Firebase offline persistence fungerar för 24-48 timmar. Det är inte lika bra som CivicBase mesh (72+ timmar, true P2P), men tillräckligt för att validera konceptet. Vi är ärliga om begränsningarna.

**Q: Vad händer med min data vid migrering till CivicBase?**  
A: All data migreras säkert. Din Hearts-historik, resursdelningar, och grannkontakter bevaras. Du ser gradvis förbättring (bättre offline, längre räckvidd), inte störande byte.

**Q: Kostar Hearts kronor?**  
A: Nej. Hearts är ömsesidighetsspårning, inte pengar. Ingen koppling till bankkonto.

**Q: Fungerar Stuga verkligen utan internet?**  
A: MVP (Firebase): Fungerar 24-48 timmar med cachad data. Production (CivicBase): Fungerar 72+ timmar via Bluetooth mesh. Båda tillräckliga för "de första 72 timmarna" som MCF pratar om.

**Q: Behöver jag BankID?**  
A: Ja, för onboarding (förhindrar falska konton). Men efter det fungerar appen offline.

**Q: Vad händer om Firebase stänger ner?**  
A: Vi migrerar till CivicBase Q4 2026 oavsett. Firebase är tillfällig. Långsiktigt kör vi på egen infrastruktur (ingen vendor lock-in).

**Q: Kan Stuga integreras med FRG?**  
A: Ja. MVP har grundläggande FRG-koppling. Production (CivicBase) ger avancerade koordineringsfunktioner.

**Q: Är detta relaterat till Fjärilspartiet?**  
A: Björn Holmström grundade båda. Fjärilspartiet förespråkar policy (STR-506), men Stuga/CivicBase är oberoende forskningsprojekt. Ingen partipolitik i appen.

**Q: Hur skiljer sig Stuga från love-ledger?**  
A: love-ledger är global vårdekonomivision med AUBI, Leaves, complex validation. Stuga är svensk krisberedskaps-implementation med bara Hearts. Olika scope, delar koncept.

**Q: Varför AI-assisterad utveckling?**  
A: Effektivt under återhämtningsperiod. AI (Claude/Gemini) skriver kod, Björn fokuserar på strategi, UX, användarbehov. Realistisk 2-3 månaders tidslinje. Sustainable.

---

**Stuga.** Grannskap som fungerar när allt annat slutar fungera. 🏘️

*Pilot: Firebase-baserad MVP (Q2 2026). Production: CivicBase-powered (Q4 2026+). Utvecklad som del av Global Governance Frameworks forskningsinitiativ.*

*Nästa steg: Säkra institutionellt stöd från Upplands Väsby kommun och Civilförsvarsförbundet, börja MVP-utveckling januari 2026.*
