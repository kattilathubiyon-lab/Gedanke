import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-black/5 dark:border-white/10">
      <div className="mx-auto max-w-3xl px-6 py-8 text-sm leading-relaxed opacity-70">
        <p className="font-medium opacity-100">
          Diese Seite ist keine Krisenintervention.
        </p>
        <p className="mt-1">
          In akuten Notlagen erreichst du die Telefonseelsorge rund um die Uhr,
          kostenlos und anonym unter{" "}
          <a href="tel:08001110111" className="underline">
            0800 111 0 111
          </a>{" "}
          oder{" "}
          <a href="tel:08001110222" className="underline">
            0800 111 0 222
          </a>
          . Bei unmittelbarer Gefahr wähle den Notruf{" "}
          <a href="tel:112" className="underline">
            112
          </a>
          . Mehr Anlaufstellen findest du auf der{" "}
          <Link href="/hilfe" className="underline">
            Hilfe-Seite
          </Link>
          .
        </p>
        <p className="mt-4 opacity-60">
          <Link href="/admin" className="hover:underline">
            Moderation
          </Link>
        </p>
      </div>
    </footer>
  );
}
