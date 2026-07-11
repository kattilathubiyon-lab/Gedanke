-- =============================================================================
-- Briefe, die bleiben – Initiale Datenbank-Migration
-- =============================================================================
-- Projektgrundsätze (gelten für das gesamte Schema):
--   * Jeder eingereichte Brief startet mit status = 'pending' und wird NIE
--     automatisch veröffentlicht. Es gibt bewusst KEINEN Auto-Publish-Pfad.
--     Nur ein Mensch (Admin) setzt status auf 'approved'.
--   * Datensparsamkeit: keine Klarnamen, Briefe anonym, keine unnötigen
--     personenbezogenen Daten.
--   * Row Level Security ist auf ALLEN Tabellen aktiv. Der öffentliche Zugriff
--     (Rollen anon/authenticated) ist strikt auf das Nötigste begrenzt.
--
-- Rollen in Supabase:
--   * anon           – nicht angemeldete Besucher (öffentlich)
--   * authenticated  – angemeldete Nutzer (hier: potenzielle Admins)
--   * service_role   – serverseitiger Schlüssel; UMGEHT RLS vollständig und
--                      braucht daher keine eigenen Policies.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Extensions
-- -----------------------------------------------------------------------------
-- gen_random_uuid() stammt aus pgcrypto (in Supabase i. d. R. bereits aktiv).
create extension if not exists "pgcrypto";


-- =============================================================================
-- profiles – Admin-/Rollenzuordnung für angemeldete Nutzer
-- =============================================================================
-- Einfache Rollenprüfung: Ein Nutzer gilt als Admin, wenn sein profiles-Eintrag
-- is_admin = true hat. Wird von allen Moderations-Policies genutzt.
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  is_admin   boolean not null default false,
  created_at timestamptz not null default now()
);

comment on table public.profiles is
  'Profil je auth-Nutzer. is_admin steuert Moderations-/Vollzugriff.';


-- =============================================================================
-- letters – die Mutmach-Briefe
-- =============================================================================
create table if not exists public.letters (
  id              uuid primary key default gen_random_uuid(),
  content         text not null,
  language        text not null default 'de',
  -- Moderationsstatus. Öffentlich sichtbar ist ausschließlich 'approved'.
  status          text not null default 'pending'
                  check (status in ('pending', 'approved', 'rejected', 'flagged')),
  author_alias    text,                              -- optionales Pseudonym, KEIN Klarname
  tags            text[] default '{}',
  times_delivered integer not null default 0,
  created_at      timestamptz not null default now(),
  reviewed_at     timestamptz,
  reviewed_by     uuid references auth.users(id)
);

comment on column public.letters.status is
  'Moderationsstatus; nur ein Mensch setzt approved. Kein Auto-Publish.';
comment on column public.letters.author_alias is
  'Optionales Pseudonym. Niemals Klarname/personenbezogene Daten.';

create index if not exists letters_status_idx on public.letters (status);
create index if not exists letters_created_at_idx on public.letters (created_at desc);


-- =============================================================================
-- deliveries – Protokoll, welcher Brief wann ausgeliefert wurde
-- =============================================================================
create table if not exists public.deliveries (
  id           uuid primary key default gen_random_uuid(),
  letter_id    uuid not null references public.letters(id) on delete cascade,
  session_id   text,                                 -- anonyme Session, KEIN Personenbezug
  delivered_at timestamptz not null default now()
);

comment on column public.deliveries.session_id is
  'Anonyme Session-Kennung. Kein Personenbezug.';

create index if not exists deliveries_letter_id_idx on public.deliveries (letter_id);


-- =============================================================================
-- feedback – Rückmeldung der Leser zu einem Brief
-- =============================================================================
create table if not exists public.feedback (
  id             uuid primary key default gen_random_uuid(),
  letter_id      uuid not null references public.letters(id) on delete cascade,
  reaction       text check (reaction in ('helped', 'no_help', 'none')),
  mood_change    text check (mood_change in
                   ('much_better', 'better', 'no_change', 'worse', 'much_worse')),
  flagged_unsafe boolean not null default false,
  note           text,
  created_at     timestamptz not null default now()
);

create index if not exists feedback_letter_id_idx on public.feedback (letter_id);


-- =============================================================================
-- reports – Meldungen problematischer Briefe
-- =============================================================================
create table if not exists public.reports (
  id         uuid primary key default gen_random_uuid(),
  letter_id  uuid not null references public.letters(id) on delete cascade,
  reason     text,
  created_at timestamptz not null default now(),
  resolved   boolean not null default false
);

create index if not exists reports_letter_id_idx on public.reports (letter_id);
create index if not exists reports_resolved_idx on public.reports (resolved);


-- =============================================================================
-- subscribers – Newsletter/Abo (für später, jetzt nur angelegt)
-- =============================================================================
create table if not exists public.subscribers (
  id                uuid primary key default gen_random_uuid(),
  email             text unique not null,
  frequency         text not null default 'weekly'
                    check (frequency in ('daily', 'weekly', 'monthly')),
  status            text not null default 'pending'
                    check (status in ('pending', 'confirmed', 'unsubscribed')),
  consent_at        timestamptz,
  consent_ip        text,
  confirm_token     text,
  unsubscribe_token text,
  created_at        timestamptz not null default now()
);


-- =============================================================================
-- Admin-Prüfung als Hilfsfunktion
-- =============================================================================
-- SECURITY DEFINER, damit die Abfrage auf profiles nicht selbst durch RLS
-- gefiltert wird (verhindert Rekursion in den profiles-Policies). Läuft mit
-- festem search_path als Härtung.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select p.is_admin from public.profiles p where p.id = auth.uid()),
    false
  );
$$;

comment on function public.is_admin() is
  'True, wenn der aktuelle auth-Nutzer ein Admin ist. Basis aller Moderations-Policies.';


-- =============================================================================
-- Neuer auth-Nutzer -> automatisch profiles-Eintrag (is_admin = false)
-- =============================================================================
-- Admin-Rechte werden bewusst NICHT automatisch vergeben. Ein Nutzer wird zum
-- Admin, indem man manuell profiles.is_admin = true setzt (siehe README).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- =============================================================================
-- Row Level Security aktivieren
-- =============================================================================
alter table public.profiles    enable row level security;
alter table public.letters     enable row level security;
alter table public.deliveries  enable row level security;
alter table public.feedback    enable row level security;
alter table public.reports     enable row level security;
alter table public.subscribers enable row level security;


-- =============================================================================
-- Policies: profiles
-- =============================================================================
-- Zweck: Ein Nutzer darf sein eigenes Profil lesen (z. B. um den Admin-Status
-- der eigenen Session zu kennen). Kein Fremdzugriff.
create policy "profiles: eigenes Profil lesen"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());

-- Zweck: Admins haben Vollzugriff auf alle Profile (z. B. weitere Admins ernennen).
create policy "profiles: Admin-Vollzugriff"
  on public.profiles
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());


-- =============================================================================
-- Policies: letters
-- =============================================================================
-- Zweck: Öffentliches Lesen NUR für freigegebene Briefe. pending/rejected/
-- flagged bleiben unsichtbar. Gilt für anon UND authenticated (Nicht-Admins).
create policy "letters: öffentlich nur approved lesen"
  on public.letters
  for select
  to anon, authenticated
  using (status = 'approved');

-- Zweck: Öffentliches Einreichen. Der neue Datensatz MUSS status = 'pending'
-- haben – so kann niemand 'approved' einschleusen (kein Auto-Publish). reviewed_*
-- muss leer bleiben. Kein Auto-Publish-Pfad.
create policy "letters: öffentlich nur als pending einreichen"
  on public.letters
  for insert
  to anon, authenticated
  with check (
    status = 'pending'
    and reviewed_at is null
    and reviewed_by is null
    and times_delivered = 0
  );

-- Zweck: Kein öffentliches UPDATE/DELETE – dafür werden bewusst KEINE Policies
-- für anon angelegt. Nur Admins (unten) dürfen ändern/löschen/moderieren.
create policy "letters: Admin-Vollzugriff (Moderation)"
  on public.letters
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());


-- =============================================================================
-- Policies: deliveries
-- =============================================================================
-- Zweck: Kein öffentlicher Zugriff. Inserts erfolgen serverseitig über den
-- service_role-Key (umgeht RLS). Daher hier nur eine Admin-Lesepolicy für die
-- Auswertung. anon hat weder SELECT noch INSERT.
create policy "deliveries: Admin-Vollzugriff"
  on public.deliveries
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());


-- =============================================================================
-- Policies: feedback
-- =============================================================================
-- Zweck: Öffentliches Einreichen von Feedback erlaubt (anonym).
create policy "feedback: öffentlich einreichen"
  on public.feedback
  for insert
  to anon, authenticated
  with check (true);

-- Zweck: KEIN öffentliches Lesen (keine SELECT-Policy für anon). Nur Admins
-- dürfen Feedback auswerten.
create policy "feedback: Admin-Vollzugriff"
  on public.feedback
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());


-- =============================================================================
-- Policies: reports
-- =============================================================================
-- Zweck: Öffentliches Melden problematischer Briefe erlaubt (anonym).
create policy "reports: öffentlich melden"
  on public.reports
  for insert
  to anon, authenticated
  with check (true);

-- Zweck: KEIN öffentliches Lesen. Nur Admins sehen und bearbeiten Meldungen.
create policy "reports: Admin-Vollzugriff"
  on public.reports
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());


-- =============================================================================
-- Policies: subscribers
-- =============================================================================
-- Zweck: KEIN öffentlicher Zugriff jeglicher Art. Anlage/Bestätigung/Abmeldung
-- laufen ausschließlich serverseitig über den service_role-Key (umgeht RLS).
-- Für anon/authenticated gibt es daher nur die Admin-Policy.
create policy "subscribers: Admin-Vollzugriff"
  on public.subscribers
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- =============================================================================
-- Ende der Migration
-- =============================================================================
