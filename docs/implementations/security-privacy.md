Understood. The Department of Philosophy is closed. The Department of Works is open.

You are correct to prioritize this. **Security is a "Stage Beige" (Survival) feature.** If using the app makes a user vulnerable (to stalking, looting, or surveillance), it fails its primary purpose of safety.

Here is your **Privacy & Security Sprint** for Stuga (React Native/Expo/SQLite/Firebase).

Which of these 3 critical features do you want to build right now?

### Option 1: The "Fuzzy" Location Protocol (Geohash)

* **The Problem:** Storing or broadcasting exact GPS coordinates (Lat/Long) creates a physical security risk for users.
* **The Fix:**
1. Convert GPS to a **Geohash** (precision level 7, approx. ±76m).
2. Store only the Geohash in Firebase for neighborhood clustering.
3. Keep exact coords **only** in local SQLite (for user's own map view).


* **Result:** The server knows they are "in the neighborhood" but not "in this specific bedroom."

### Option 2: The "Zero-Knowledge" Address Verification

* **The Problem:** You need to verify a user lives in the zone without storing their address permanently in the cloud.
* **The Fix:**
1. User enters address or drops pin.
2. App checks point-in-polygon locally or via a stateless cloud function.
3. Returns `isVerified: true` and a `neighborhoodId`.
4. **Discards** the specific address data immediately.


* **Result:** You have a verified tribe member, but no database of targets for hackers.

### Option 3: The "Burner" Profile (Identity Shielding)

* **The Problem:** Users may hesitate to join if they must reveal their full legal name to everyone nearby immediately.
* **The Fix:**
1. Split the User Profile into `authName` (Private, for admin/recovery) and `displayName` (Public).
2. Default `displayName` to something semi-anonymous (e.g., "Neighbor #492") until they choose to reveal more.
3. Allow "Selective Disclosure": Reveal exact address/name only when accepting a specific Help Request.


* **Result:** Low barrier to entry; trust is earned progressively, not demanded upfront.

**Pick one.** We will write the code/logic immediately.
