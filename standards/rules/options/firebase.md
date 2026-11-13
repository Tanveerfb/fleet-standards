# Fleet rules — option: Firebase (`rules/options/firebase.md`)

**Loaded by:** projects that chose it at setup.
One file of the fleet standard. `project-rules.md` is the core: its §SCOPE lists every file in
the set and who loads it, and its header carries the one version they share.

---

## §FIREBASE — Firebase

The default backend for auth, data and storage across the fleet.

- **Two SDKs, and the boundary between them is the whole rule.** The client SDK
  (`firebase`) is initialised once, in `lib/firebase/client.ts`, and used from client
  components. The Admin SDK (`firebase-admin`) is **server-only** — Route Handlers, Server
  Actions, `*.server.ts` modules — and lives in `lib/firebase/admin.ts` opening with
  `import "server-only"`. **Never import the Admin SDK from a file a client bundle can
  reach.**
- **Service account keys follow §SECURITY** — outside the repo by preference, never
  committed.
- **Environment variables.** Client-exposed config is `NEXT_PUBLIC_FIREBASE_*` — `API_KEY`,
  `AUTH_DOMAIN`, `PROJECT_ID`, `STORAGE_BUCKET`, `MESSAGING_SENDER_ID`, `APP_ID`. Admin
  credentials and any admin allowlist stay server-only and unprefixed. All of it in
  `.env.local`, gitignored. Record every one in `environment.md` (§DOCS) by name and owner,
  never by value.
- **One Firebase project, many apps: use a named database.** `getFirestore(app, "db-name")`,
  never the default, when an internal tool shares a Firebase project with a public site.
  Isolation without a second project.
- **A duplicated authorisation check must be noted at both sites.** An admin allowlist that
  exists in app code *and* in `firestore.rules` is two sources of truth kept in sync by hand.
  When you touch either, say so at the other.
- **Editing `firestore.rules` does nothing until it is deployed.** Validate first
  (`firebase_validate_security_rules` via the Firebase MCP), then
  `firebase deploy --only firestore:rules`. Then read the live rules back and compare them
  with the file, and trust nothing less: a deploy can report success and change nothing
  (`godot-toll`, 2026-10-23: the MCP's `firestore:rules` target did this, `firestore`
  worked). If they cannot be read back, say the rules are unconfirmed.
- **A composite index is declared in `firestore.indexes.json`, and a missing one does not
  fail fast.** The Admin SDK retries, so the symptom is a build that *hangs* until the
  framework kills the page, reporting nothing useful. Suspect a missing index before
  anything else when a page build times out.
- **Firebase is not exempt from §QOL or §FORMS.** Every read and write path gets loading,
  error and empty states.
- **A public page never fetches Firestore in a component.** It serves crawlers an empty
  skeleton, which for a content site is the whole ballgame. Read on the server; the one
  exception is an admin preview route rendering an unpublished draft, which the server path
  will not return.
