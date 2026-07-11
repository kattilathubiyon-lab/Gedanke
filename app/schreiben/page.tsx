import Link from "next/link";
import SubmitLetterForm from "@/components/SubmitLetterForm";

const ERRORS: Record<string, string> = {
  zu_kurz: "Bitte schreib ein paar Zeilen mehr (mindestens 20 Zeichen).",
  fehler: "Da ist etwas schiefgelaufen. Bitte versuch es noch einmal.",
  not_configured:
    "Die Datenbank ist noch nicht eingerichtet. Bitte später erneut versuchen.",
};

export default async function SchreibenPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const message = error ? ERRORS[error] : null;

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold">Einen Brief schreiben</h1>
      <p className="mt-2 leading-relaxed opacity-80">
        Deine Zeilen können jemandem an einem schweren Tag Halt geben. Der Brief
        erscheint anonym und wird vorher von einem Menschen gelesen.
      </p>

      <div className="mt-4 rounded-xl border border-black/10 bg-black/[0.03] p-4 text-sm leading-relaxed dark:border-white/10 dark:bg-white/5">
        Diese Seite ist kein Ort für Krisen-Notrufe. Wenn es dir gerade sehr
        schlecht geht, findest du auf der{" "}
        <Link href="/hilfe" className="underline">
          Hilfe-Seite
        </Link>{" "}
        sofortige, kostenlose Unterstützung.
      </div>

      {message && (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-700 dark:text-red-300">
          {message}
        </div>
      )}

      <div className="mt-8">
        <SubmitLetterForm />
      </div>
    </main>
  );
}
