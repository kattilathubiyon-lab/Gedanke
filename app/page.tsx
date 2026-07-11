import Link from "next/link";
import LetterReader from "@/components/LetterReader";
import { deliverRandomLetter } from "@/lib/delivery";
import { isSupabaseConfigured } from "@/lib/supabase/config";

// Jeder Aufruf liefert einen frischen Brief aus – keine Zwischenspeicherung.
export const dynamic = "force-dynamic";

export default async function Home() {
  const configured = isSupabaseConfigured();
  const initialLetter = configured ? await deliverRandomLetter([]) : null;

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <section className="mb-10">
        <p className="text-sm uppercase tracking-widest opacity-60">
          Ein Brief für dich
        </p>
        <h1 className="mt-2 text-2xl font-semibold leading-snug sm:text-3xl">
          Manchmal reicht ein paar Zeilen, um sich weniger allein zu fühlen.
        </h1>
      </section>

      {configured ? (
        <LetterReader initialLetter={initialLetter} />
      ) : (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 text-sm leading-relaxed">
          <p className="font-medium">Supabase ist noch nicht konfiguriert.</p>
          <p className="mt-2 opacity-80">
            Trage in <code>.env.local</code> deine Supabase-Zugangsdaten ein und
            spiele die Migration ein (siehe README). Danach erscheinen hier die
            freigegebenen Briefe.
          </p>
        </div>
      )}

      <section className="mt-12 rounded-2xl bg-black/[0.03] p-6 dark:bg-white/5">
        <h2 className="text-lg font-medium">Möchtest du selbst Mut machen?</h2>
        <p className="mt-1 text-sm leading-relaxed opacity-80">
          Schreib einen Brief an jemanden, den du nie treffen wirst. Jeder Brief
          wird von einem Menschen gelesen, bevor er erscheint.
        </p>
        <Link
          href="/schreiben"
          className="mt-4 inline-block rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-black"
        >
          Brief schreiben
        </Link>
      </section>
    </main>
  );
}
