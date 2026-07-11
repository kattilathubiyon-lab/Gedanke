import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-black/5 dark:border-white/10">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="font-semibold tracking-tight">
          Briefe, die bleiben
        </Link>
        <nav className="flex items-center gap-4 text-sm opacity-80">
          <Link href="/" className="hover:opacity-100 hover:underline">
            Lesen
          </Link>
          <Link href="/schreiben" className="hover:opacity-100 hover:underline">
            Schreiben
          </Link>
          <Link href="/hilfe" className="hover:opacity-100 hover:underline">
            Hilfe
          </Link>
        </nav>
      </div>
    </header>
  );
}
