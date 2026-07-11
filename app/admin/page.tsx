import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { moderateLetter, resolveReport, signOut } from "@/app/admin/actions";
import type { AdminLetter, LetterStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<LetterStatus, string> = {
  pending: "Wartet",
  approved: "Freigegeben",
  rejected: "Abgelehnt",
  flagged: "Markiert",
};

function formatDate(value: string): string {
  return new Date(value).toLocaleString("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function ModButton({
  id,
  action,
  label,
  variant,
}: {
  id: string;
  action: "approve" | "reject" | "flag";
  label: string;
  variant: "primary" | "muted" | "warn";
}) {
  const styles = {
    primary:
      "bg-emerald-600 text-white hover:opacity-90",
    warn: "bg-amber-500 text-white hover:opacity-90",
    muted:
      "border border-black/15 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10",
  }[variant];

  return (
    <form action={moderateLetter}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="action" value={action} />
      <button
        type="submit"
        className={`rounded-full px-4 py-1.5 text-sm font-medium ${styles}`}
      >
        {label}
      </button>
    </form>
  );
}

function LetterItem({ letter }: { letter: AdminLetter }) {
  return (
    <li className="rounded-xl border border-black/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
      <div className="mb-2 flex items-center justify-between gap-3 text-xs opacity-60">
        <span>{formatDate(letter.created_at)}</span>
        <span className="rounded-full bg-black/5 px-2 py-0.5 dark:bg-white/10">
          {STATUS_LABEL[letter.status]}
        </span>
      </div>
      <p className="whitespace-pre-line text-sm leading-relaxed">
        {letter.content}
      </p>
      <p className="mt-2 text-xs italic opacity-60">
        {letter.author_alias ? `— ${letter.author_alias}` : "— anonym"}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {letter.status !== "approved" && (
          <ModButton
            id={letter.id}
            action="approve"
            label="Freigeben"
            variant="primary"
          />
        )}
        {letter.status !== "flagged" && (
          <ModButton
            id={letter.id}
            action="flag"
            label="Markieren"
            variant="warn"
          />
        )}
        {letter.status !== "rejected" && (
          <ModButton
            id={letter.id}
            action="reject"
            label="Ablehnen"
            variant="muted"
          />
        )}
      </div>
    </li>
  );
}

function Section({
  title,
  letters,
  empty,
}: {
  title: string;
  letters: AdminLetter[];
  empty: string;
}) {
  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-wider opacity-60">
        {title} <span className="opacity-60">({letters.length})</span>
      </h2>
      {letters.length === 0 ? (
        <p className="mt-3 text-sm opacity-50">{empty}</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-3">
          {letters.map((l) => (
            <LetterItem key={l.id} letter={l} />
          ))}
        </ul>
      )}
    </section>
  );
}

type ReportWithLetter = {
  id: string;
  reason: string | null;
  created_at: string;
  letter_id: string;
  letters: { content: string; status: LetterStatus } | null;
};

export default async function AdminPage() {
  if (!isSupabaseConfigured()) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-2xl font-semibold">Moderation</h1>
        <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
          Supabase ist noch nicht konfiguriert – siehe README.
        </div>
      </main>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-2xl font-semibold">Kein Zugriff</h1>
        <p className="mt-2 opacity-80">
          Das Konto <strong>{user.email}</strong> hat keine Moderationsrechte.
        </p>
        <form action={signOut} className="mt-6">
          <button className="rounded-full border border-black/15 px-5 py-2 text-sm dark:border-white/20">
            Abmelden
          </button>
        </form>
      </main>
    );
  }

  const [pendingRes, flaggedRes, approvedRes, reportsRes] = await Promise.all([
    supabase
      .from("letters")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true }),
    supabase
      .from("letters")
      .select("*")
      .eq("status", "flagged")
      .order("created_at", { ascending: true }),
    supabase
      .from("letters")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("reports")
      .select("id, reason, created_at, letter_id, letters(content, status)")
      .eq("resolved", false)
      .order("created_at", { ascending: true }),
  ]);

  const pending = (pendingRes.data ?? []) as AdminLetter[];
  const flagged = (flaggedRes.data ?? []) as AdminLetter[];
  const approved = (approvedRes.data ?? []) as AdminLetter[];
  const reports = (reportsRes.data ?? []) as unknown as ReportWithLetter[];

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Moderation</h1>
          <p className="text-sm opacity-60">{user.email}</p>
        </div>
        <form action={signOut}>
          <button className="rounded-full border border-black/15 px-4 py-1.5 text-sm dark:border-white/20">
            Abmelden
          </button>
        </form>
      </div>

      <div className="mt-10 flex flex-col gap-10">
        {reports.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
              Offene Meldungen ({reports.length})
            </h2>
            <ul className="mt-3 flex flex-col gap-3">
              {reports.map((r) => (
                <li
                  key={r.id}
                  className="rounded-xl border border-red-500/20 bg-red-500/5 p-5"
                >
                  <div className="mb-2 flex items-center justify-between gap-3 text-xs opacity-60">
                    <span>{formatDate(r.created_at)}</span>
                    <span>Brief-Status: {r.letters?.status ?? "unbekannt"}</span>
                  </div>
                  {r.reason && (
                    <p className="text-sm">
                      <span className="opacity-60">Grund: </span>
                      {r.reason}
                    </p>
                  )}
                  {r.letters?.content && (
                    <p className="mt-2 whitespace-pre-line rounded-lg bg-black/5 p-3 text-sm leading-relaxed dark:bg-white/10">
                      {r.letters.content}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <ModButton
                      id={r.letter_id}
                      action="flag"
                      label="Brief markieren"
                      variant="warn"
                    />
                    <ModButton
                      id={r.letter_id}
                      action="reject"
                      label="Brief ablehnen"
                      variant="muted"
                    />
                    <form action={resolveReport}>
                      <input type="hidden" name="id" value={r.id} />
                      <button className="rounded-full border border-black/15 px-4 py-1.5 text-sm dark:border-white/20">
                        Meldung erledigt
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <Section
          title="Wartet auf Prüfung"
          letters={pending}
          empty="Nichts zu prüfen. Schön ruhig hier."
        />
        <Section
          title="Markiert"
          letters={flagged}
          empty="Keine markierten Briefe."
        />
        <Section
          title="Zuletzt freigegeben"
          letters={approved}
          empty="Noch keine freigegebenen Briefe."
        />
      </div>

      <p className="mt-12 text-xs opacity-50">
        <Link href="/" className="hover:underline">
          ← Zur Startseite
        </Link>
      </p>
    </main>
  );
}
