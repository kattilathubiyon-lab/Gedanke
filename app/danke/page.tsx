import Link from "next/link";

export default function DankePage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-start gap-4 px-6 py-16">
      <h1 className="font-serif text-3xl font-medium">Danke für deinen Brief.</h1>
      <p className="leading-relaxed opacity-80">
        Er ist eingegangen und wartet nun auf die Prüfung durch einen Menschen.
        Erst danach kann er anderen angezeigt werden – automatisch veröffentlicht
        wird nichts. Das kann etwas dauern; wir bitten um deine Geduld.
      </p>
      <p className="leading-relaxed opacity-80">
        Vielleicht magst du in der Zwischenzeit selbst einen Brief lesen?
      </p>
      <div className="mt-2 flex gap-3">
        <Link
          href="/"
          className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 dark:bg-white dark:text-black"
        >
          Einen Brief lesen
        </Link>
        <Link
          href="/schreiben"
          className="rounded-full border border-black/15 px-5 py-2.5 text-sm font-medium hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
        >
          Noch einen schreiben
        </Link>
      </div>
    </main>
  );
}
