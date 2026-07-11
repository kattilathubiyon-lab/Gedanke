"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { submitLetter } from "@/app/actions";

const MAX_LENGTH = 5000;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-black"
    >
      {pending ? "Wird gesendet …" : "Brief einreichen"}
    </button>
  );
}

export default function SubmitLetterForm() {
  const [count, setCount] = useState(0);

  return (
    <form action={submitLetter} className="flex flex-col gap-5">
      <div>
        <label htmlFor="content" className="block text-sm font-medium">
          Dein Brief
        </label>
        <p className="mt-1 text-xs opacity-60">
          Schreib so, wie du es jemandem sagen würdest, der einen schweren Tag
          hat. Bitte keine Klarnamen oder Kontaktdaten.
        </p>
        <textarea
          id="content"
          name="content"
          required
          minLength={20}
          maxLength={MAX_LENGTH}
          rows={10}
          onChange={(e) => setCount(e.target.value.length)}
          placeholder="Liebe:r Unbekannte:r, …"
          className="mt-2 w-full rounded-xl border border-black/10 bg-white/70 p-4 text-base leading-relaxed outline-none focus:border-black/30 dark:border-white/15 dark:bg-white/5 dark:focus:border-white/30"
        />
        <div className="mt-1 text-right text-xs opacity-50">
          {count} / {MAX_LENGTH}
        </div>
      </div>

      <div>
        <label htmlFor="author_alias" className="block text-sm font-medium">
          Pseudonym <span className="opacity-60">(optional)</span>
        </label>
        <input
          id="author_alias"
          name="author_alias"
          type="text"
          maxLength={60}
          placeholder="z. B. „Jemand, der es geschafft hat“"
          className="mt-2 w-full rounded-xl border border-black/10 bg-white/70 p-3 text-base outline-none focus:border-black/30 dark:border-white/15 dark:bg-white/5 dark:focus:border-white/30"
        />
      </div>

      <div className="flex items-center gap-4">
        <SubmitButton />
        <p className="text-xs opacity-60">
          Wird erst nach Prüfung durch einen Menschen veröffentlicht.
        </p>
      </div>
    </form>
  );
}
