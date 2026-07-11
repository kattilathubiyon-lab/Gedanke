import type { PublicLetter } from "@/lib/types";

/** Reine Darstellung eines Briefs (Server- oder Client-nutzbar). */
export default function LetterCard({ letter }: { letter: PublicLetter }) {
  return (
    <article className="rounded-2xl border border-black/5 bg-white/60 p-7 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-9">
      <p className="whitespace-pre-line text-lg leading-relaxed">
        {letter.content}
      </p>

      {letter.author_alias ? (
        <p className="mt-6 text-sm italic opacity-70">
          — {letter.author_alias}
        </p>
      ) : (
        <p className="mt-6 text-sm italic opacity-50">— anonym</p>
      )}

      {letter.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {letter.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-black/5 px-3 py-1 text-xs opacity-70 dark:bg-white/10"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
