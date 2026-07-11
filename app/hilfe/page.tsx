import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hilfe & Anlaufstellen – Briefe, die bleiben",
  description:
    "Professionelle, kostenlose und anonyme Hilfsangebote in Deutschland.",
};

type Resource = {
  name: string;
  detail: string;
  phone?: string;
  phoneLabel?: string;
  href?: string;
  hrefLabel?: string;
};

const IMMEDIATE: Resource[] = [
  {
    name: "Notruf",
    detail: "Bei unmittelbarer Gefahr für dich oder andere.",
    phone: "112",
    phoneLabel: "112",
  },
  {
    name: "Telefonseelsorge",
    detail: "Rund um die Uhr, kostenlos und anonym – auch per Chat und Mail.",
    phone: "08001110111",
    phoneLabel: "0800 111 0 111",
    href: "https://www.telefonseelsorge.de",
    hrefLabel: "telefonseelsorge.de",
  },
  {
    name: "Telefonseelsorge (zweite Nummer)",
    detail: "Alternative kostenlose Rufnummer, ebenfalls rund um die Uhr.",
    phone: "08001110222",
    phoneLabel: "0800 111 0 222",
  },
];

const FURTHER: Resource[] = [
  {
    name: "Info-Telefon Depression",
    detail: "Stiftung Deutsche Depressionshilfe, zu festen Sprechzeiten.",
    phone: "08003344533",
    phoneLabel: "0800 3344533",
    href: "https://www.deutsche-depressionshilfe.de",
    hrefLabel: "deutsche-depressionshilfe.de",
  },
  {
    name: "Nummer gegen Kummer – für Kinder & Jugendliche",
    detail: "Kostenlos und anonym, zu festen Zeiten.",
    phone: "116111",
    phoneLabel: "116 111",
    href: "https://www.nummergegenkummer.de",
    hrefLabel: "nummergegenkummer.de",
  },
  {
    name: "Nummer gegen Kummer – für Eltern",
    detail: "Beratung für Eltern und Erwachsene rund um Erziehung und Sorgen.",
    phone: "08001110550",
    phoneLabel: "0800 111 0 550",
  },
  {
    name: "Deutsche DepressionsLiga",
    detail: "Selbsthilfe und Informationen für Betroffene und Angehörige.",
    href: "https://www.depressionsliga.de",
    hrefLabel: "depressionsliga.de",
  },
];

function ResourceItem({ r }: { r: Resource }) {
  return (
    <li className="rounded-xl border border-black/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
      <p className="font-medium">{r.name}</p>
      <p className="mt-1 text-sm leading-relaxed opacity-80">{r.detail}</p>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
        {r.phone && (
          <a href={`tel:${r.phone}`} className="font-medium underline">
            {r.phoneLabel}
          </a>
        )}
        {r.href && (
          <a
            href={r.href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline opacity-80"
          >
            {r.hrefLabel}
          </a>
        )}
      </div>
    </li>
  );
}

export default function HilfePage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-serif text-3xl font-medium">Hilfe &amp; Anlaufstellen</h1>
      <p className="mt-2 leading-relaxed opacity-80">
        „Briefe, die bleiben“ ist ein Ort für ermutigende Worte – aber{" "}
        <strong>keine Krisenintervention</strong>. Wenn du gerade nicht mehr
        weiterweißt, wende dich bitte an die folgenden Stellen. Dort sind
        Menschen, die zuhören.
      </p>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider opacity-60">
          Sofort erreichbar
        </h2>
        <ul className="mt-3 flex flex-col gap-3">
          {IMMEDIATE.map((r) => (
            <ResourceItem key={r.name} r={r} />
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider opacity-60">
          Weitere Anlaufstellen
        </h2>
        <ul className="mt-3 flex flex-col gap-3">
          {FURTHER.map((r) => (
            <ResourceItem key={r.name} r={r} />
          ))}
        </ul>
      </section>

      <p className="mt-8 text-xs leading-relaxed opacity-60">
        Angaben ohne Gewähr. Rufnummern und Sprechzeiten können sich ändern – im
        Zweifel bitte auf den verlinkten Seiten prüfen.
      </p>
    </main>
  );
}
