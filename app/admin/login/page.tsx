import { signIn } from "@/app/admin/actions";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const ERRORS: Record<string, string> = {
  credentials: "E-Mail oder Passwort stimmen nicht.",
  forbidden: "Dieses Konto hat keine Moderationsrechte.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const message = error ? ERRORS[error] : null;

  return (
    <main className="mx-auto max-w-sm px-6 py-16">
      <h1 className="text-2xl font-semibold">Moderation – Anmeldung</h1>
      <p className="mt-2 text-sm leading-relaxed opacity-70">
        Nur für Moderator:innen. Zugang wird über Supabase-Auth verwaltet.
      </p>

      {!isSupabaseConfigured() && (
        <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
          Supabase ist noch nicht konfiguriert – siehe README.
        </div>
      )}

      {message && (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-700 dark:text-red-300">
          {message}
        </div>
      )}

      <form action={signIn} className="mt-8 flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            E-Mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-1 w-full rounded-xl border border-black/10 bg-white/70 p-3 outline-none focus:border-black/30 dark:border-white/15 dark:bg-white/5 dark:focus:border-white/30"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Passwort
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded-xl border border-black/10 bg-white/70 p-3 outline-none focus:border-black/30 dark:border-white/15 dark:bg-white/5 dark:focus:border-white/30"
          />
        </div>
        <button
          type="submit"
          className="mt-2 rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 dark:bg-white dark:text-black"
        >
          Anmelden
        </button>
      </form>
    </main>
  );
}
