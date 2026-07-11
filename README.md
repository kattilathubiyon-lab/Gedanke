# Briefe, die bleiben

Eine Web-App, die anonyme, **moderierte** Mutmach-Briefe zeigt. Besucher lesen
einen Brief, der ihnen guttut, können weitere lesen und selbst einen schreiben.
Warmer, ermutigender Ton, deutsches Publikum.

> **Wichtig:** Diese Seite ist ausdrücklich **keine Krisenintervention**. Sie
> verlinkt aber an geeigneter Stelle professionelle Hilfe.

## Grundsätze (gelten für das gesamte Projekt)

- **Kein Auto-Publish.** Jeder eingereichte Brief startet mit Status `pending`
  und wird **nie automatisch** veröffentlicht. Nur ein Mensch gibt frei. Es gibt
  bewusst keinen Auto-Publish-Pfad – auch nicht in der Datenbank (siehe
  RLS-Policies).
- **Datensparsamkeit.** Keine Klarnamen, Briefe anonym, keine unnötigen
  personenbezogenen Daten.
- **EU-Region.** Alle Server-Ressourcen liegen in der EU (Supabase-Projekt in
  Frankfurt / `eu-central-1`).

## Tech-Stack

- [Next.js](https://nextjs.org/) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) (v4)
- [Supabase](https://supabase.com/) (Postgres, Auth, RLS) via
  `@supabase/supabase-js` und `@supabase/ssr`

## Funktionen (Prototyp)

| Route | Beschreibung |
| --- | --- |
| `/` | Zeigt einen zufälligen **freigegebenen** Brief; „weiteren lesen", Ja/Nein-Feedback, Melden |
| `/schreiben` | Brief einreichen – landet **immer** als `pending` |
| `/danke` | Bestätigung nach dem Einreichen (Hinweis auf menschliche Prüfung) |
| `/hilfe` | Professionelle Anlaufstellen + Krisenhinweis (keine Krisenintervention) |
| `/admin/login` | Anmeldung für Moderator:innen (Supabase-Auth) |
| `/admin` | Moderations-Dashboard: freigeben / ablehnen / markieren, Meldungen bearbeiten |
| `POST /api/next-letter` | Liefert serverseitig einen zufälligen freigegebenen Brief + protokolliert die Auslieferung (Service Role) |
| `POST /api/feedback`, `POST /api/report` | Anonymes Feedback bzw. Meldung (Anon-Client, RLS) |

Die Auslieferung nutzt eine **anonyme** Session-Kennung (zufälliges Cookie
`bdb_session`, kein Personenbezug), die die Middleware setzt.

## Ordnerstruktur

```
app/
  page.tsx               # Startseite: Brief lesen
  schreiben/, danke/     # Brief einreichen
  hilfe/                 # Anlaufstellen
  admin/                 # Login + Moderations-Dashboard (+ actions.ts)
  api/                   # Route Handler: next-letter, feedback, report
  actions.ts             # Public Server Action (Brief einreichen)
components/              # SiteHeader/Footer, LetterCard/Reader, SubmitLetterForm
lib/
  delivery.ts            # Auslieferungs-Logik (Service Role, server-only)
  types.ts               # Gemeinsame TypeScript-Typen
  supabase/
    client.ts            # Browser-Client (Anon-Key) für Client Components
    server.ts            # Server-Client (Anon-Key + Cookies) für Server-Kontext
    admin.ts             # Service-Role-Client – NUR serverseitig, umgeht RLS
    middleware.ts        # Session-Refresh + anonymes Session-Cookie
    config.ts            # Konfigurations-/Env-Check
middleware.ts            # Next.js Middleware (ruft supabase/middleware auf)
supabase/
  migrations/            # SQL-Migrationen (Schema + RLS-Policies)
  seed.sql               # Optionale Beispielbriefe (approved)
```

## Setup

### 1. Abhängigkeiten installieren

```bash
npm install
```

### 2. Supabase-Projekt anlegen (EU-Region!)

1. Auf [supabase.com](https://supabase.com/) einloggen und **New project** wählen.
2. **Region:** unbedingt **Central EU (Frankfurt)** / `eu-central-1` auswählen,
   damit alle Daten in der EU liegen. Die Region lässt sich nachträglich **nicht**
   ändern – im Zweifel das Projekt neu anlegen.
3. Ein sicheres Datenbank-Passwort vergeben und das Projekt erstellen.

### 3. Datenbank-Migration einspielen

Die Migration liegt in `supabase/migrations/0001_initial_schema.sql`. Sie legt
alle Tabellen an und aktiviert Row Level Security inklusive Policies.

**Variante A – Supabase Dashboard (am einfachsten):**

1. Im Dashboard **SQL Editor** öffnen.
2. Inhalt von `supabase/migrations/0001_initial_schema.sql` hineinkopieren.
3. **Run** klicken.

**Variante B – Supabase CLI:**

```bash
# Einmalig: CLI installieren (siehe supabase.com/docs) und einloggen
supabase login

# Lokales Repo mit dem Remote-Projekt verknüpfen (Project-Ref aus dem Dashboard)
supabase link --project-ref <your-project-ref>

# Migration(en) einspielen
supabase db push
```

#### Optional: Beispielbriefe einspielen

Damit auf der Startseite sofort etwas zu lesen ist, kannst du
`supabase/seed.sql` ausführen (Dashboard → SQL Editor, oder `supabase db reset`,
das Migration + Seed neu einspielt). Diese Briefe werden bewusst von dir als
Mensch direkt als `approved` eingefügt – das ist **kein** Auto-Publish-Pfad.

### 4. Environment-Variablen setzen

Kopiere die Vorlage und trage deine Werte aus dem Supabase-Dashboard
(**Project Settings → API**) ein:

```bash
cp .env.example .env.local
```

| Variable | Sichtbarkeit | Zweck |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | öffentlich (Browser) | Projekt-URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | öffentlich (Browser) | Anon-Key; Zugriff wird per RLS begrenzt |
| `SUPABASE_SERVICE_ROLE_KEY` | **geheim, nur Server** | Umgeht RLS vollständig |

> **⚠️ Service-Role-Key:** Der `SUPABASE_SERVICE_ROLE_KEY` **umgeht Row Level
> Security vollständig** und darf **ausschließlich serverseitig** verwendet
> werden (Route Handler, Server Actions, Cron-Jobs). Er hat bewusst **kein**
> `NEXT_PUBLIC_`-Präfix, damit Next.js ihn nicht ins Browser-Bundle aufnimmt.
> Niemals in Client-Code importieren, niemals ins Git-Repo committen.
> `.env.local` ist in `.gitignore` ausgeschlossen.

### 5. Entwicklungsserver starten

```bash
npm run dev
```

App läuft auf [http://localhost:3000](http://localhost:3000).

## Admin-/Moderationsrechte vergeben

Voller Zugriff (alle Status lesen, moderieren, Reports/Feedback einsehen) ist an
`profiles.is_admin = true` gebunden. Ein neuer auth-Nutzer bekommt automatisch
ein Profil mit `is_admin = false`. Um jemanden zum Admin zu machen:

1. Nutzer in Supabase anlegen (**Authentication → Users → Add user**, mit
   E-Mail + Passwort). Beim Anlegen entsteht per Trigger automatisch ein Profil
   mit `is_admin = false`.
2. Im **SQL Editor** ausführen:

   ```sql
   update public.profiles set is_admin = true
   where id = '<auth-user-id>';
   ```

3. Unter [`/admin/login`](http://localhost:3000/admin/login) mit E-Mail und
   Passwort anmelden. Das Dashboard unter `/admin` zeigt dann wartende,
   markierte und freigegebene Briefe sowie offene Meldungen.

## Datenmodell & Sicherheit (Kurzüberblick)

| Tabelle | Öffentlicher Zugriff (anon) |
| --- | --- |
| `letters` | SELECT nur `status = 'approved'`; INSERT nur mit `status = 'pending'`; kein UPDATE/DELETE |
| `feedback` | nur INSERT (kein SELECT) |
| `reports` | nur INSERT (kein SELECT) |
| `deliveries` | kein Zugriff (Insert serverseitig via Service Role) |
| `subscribers` | kein Zugriff (komplett serverseitig) |
| `profiles` | nur eigenes Profil lesen |

Voller Zugriff auf alle Tabellen/Status ist ausschließlich Admins vorbehalten
(RLS-Prüfung via `public.is_admin()`). Details und Kommentare siehe
`supabase/migrations/0001_initial_schema.sql`.
