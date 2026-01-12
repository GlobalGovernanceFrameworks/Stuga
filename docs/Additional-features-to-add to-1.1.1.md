Detta är en mycket skarpsynt observation. Du har identifierat en diskrepans mellan **Roadmapen** (där "Block Captains" ligger i Fas 1.5/Q3) och **Säljpichen** (där vi lovar det till våren).

Men att ta bort det ur pitchen vore ett misstag. "Kvartersvärden" är nämligen den **enda** anledningen till att kommunen vill ha detta. Utan den är det bara en app för grannar. Med den är det *civilförsvar*.

Så här löser vi det utan att stressa ihjäl dig:

### 1. Bygg "Kvartersvärd Lite" (Inte hela Red-stadiet)

Du behöver inte bygga hela ledningssystemet (Emergency Broadcast, Resource Allocation Dashboard) till april. Du behöver bara operationalisera *rollen*.

Här är skillnaden mellan vad som står i Roadmap v1.5 och vad vi kan göra till piloten:

| Feature | Roadmap v1.5 (Full "Red") | Pilot-version ("Kvartersvärd Lite") | Arbetsinsats |
| --- | --- | --- | --- |
| **Rekrytering** | Automatisk omröstning/val | **Self-selection:** "Jag vill vara Kvartersvärd" (opt-in i profilen) | 1 timme |
| **Status** | Dynamisk roll med befogenheter | **Visuell Badge:** En ikon vid namnet (som du redan har kod för i `reputationHelpers.ts`) | 30 min |
| **Verktyg** | Crisis Dashboard & Broadcast | **Statisk Checklista:** En enkel vy med text: "Vid kris: 1. Kolla grannen..." | 4 timmar |
| **Koppling** | Digital integration mot kommun | **Manuell:** Kvartersvärden får ett telefonnummer till kommunens säkerhetsenhet. | 0 min (kod) |

### 2. Tidsanalysen (Du har tid)

* **Din velocity:** Du byggde hela v1.1.1 (kärnan) på **16 dagar** (27 dec - 12 jan). Det är extremt snabbt.
* **Tid kvar:** Du har ca **11 veckor** till 1 april.

Att lägga till en "Opt-in"-knapp, en Badge och en statisk "Checklista"-skärm tar dig förmodligen 2-3 dagar i din nuvarande takt.

### 3. Strategisk Rekommendation

**Behåll texten i dokumentet.**
Löftet i dokumentet är: *"Appen identifierar frivilliga... får digitala checklistor"*.
Detta är tekniskt sett sant även med "Lite"-versionen.

**Gör så här:**

1. I din `feature/spiral-advanced`-branch: Lägg till en bool `is_block_captain` i User-modellen.
2. I `reputationHelpers.ts`: Lägg till en badge för det.
3. Skapa en ny, superenkel skärm: `BlockCaptainGuide.tsx` som bara visar checklistan (vi kan be Claude skriva texten till den senare).

**Slutsats:**
Du hinner. Och det är värt det, för det gör att appen går från "kul grej" till "kritisk infrastruktur" i kommunens ögon.

Ska vi köra på det? Vi kan spika dokumentet som det är.
