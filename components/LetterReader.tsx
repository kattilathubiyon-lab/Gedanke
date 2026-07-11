"use client";

import { useState } from "react";
import Link from "next/link";
import type { PublicLetter } from "@/lib/types";
import LetterCard from "./LetterCard";

type FeedbackState = "idle" | "sending" | "done";

export default function LetterReader({
  initialLetter,
}: {
  initialLetter: PublicLetter | null;
}) {
  const [letter, setLetter] = useState<PublicLetter | null>(initialLetter);
  const [seen, setSeen] = useState<string[]>(
    initialLetter ? [initialLetter.id] : [],
  );
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>("idle");
  const [reported, setReported] = useState(false);

  async function loadNext() {
    setLoading(true);
    setFeedback("idle");
    setReported(false);
    try {
      const res = await fetch("/api/next-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exclude: seen }),
      });
      const data = (await res.json()) as { letter: PublicLetter | null };
      if (data.letter) {
        setLetter(data.letter);
        setSeen((prev) => [...prev, data.letter!.id].slice(-50));
      }
    } finally {
      setLoading(false);
    }
  }

  async function sendReaction(reaction: "helped" | "no_help") {
    if (!letter || feedback === "sending") return;
    setFeedback("sending");
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ letter_id: letter.id, reaction }),
      });
      setFeedback("done");
    } catch {
      setFeedback("idle");
    }
  }

  async function report() {
    if (!letter || reported) return;
    const reason = window.prompt(
      "Warum meldest du diesen Brief? (optional)",
      "",
    );
    if (reason === null) return; // abgebrochen
    setReported(true);
    await fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ letter_id: letter.id, reason }),
    });
  }

  if (!letter) {
    return (
      <div className="rounded-2xl border border-black/5 bg-white/60 p-8 text-center dark:border-white/10 dark:bg-white/5">
        <p className="text-lg">
          Gerade ist noch kein freigegebener Brief da.
        </p>
        <p className="mt-2 opacity-70">
          Möchtest du den ersten schreiben?{" "}
          <Link href="/schreiben" className="underline">
            Brief schreiben
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <LetterCard letter={letter} />

      <div className="mt-6 flex flex-col gap-4">
        <button
          onClick={loadNext}
          disabled={loading}
          className="self-start rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {loading ? "Einen Moment …" : "Weiteren Brief lesen"}
        </button>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          {feedback === "done" ? (
            <span className="opacity-70">Danke für deine Rückmeldung.</span>
          ) : (
            <>
              <span className="opacity-70">Hat dir dieser Brief gutgetan?</span>
              <button
                onClick={() => sendReaction("helped")}
                disabled={feedback === "sending"}
                className="rounded-full border border-black/10 px-3 py-1 hover:bg-black/5 disabled:opacity-50 dark:border-white/15 dark:hover:bg-white/10"
              >
                Ja
              </button>
              <button
                onClick={() => sendReaction("no_help")}
                disabled={feedback === "sending"}
                className="rounded-full border border-black/10 px-3 py-1 hover:bg-black/5 disabled:opacity-50 dark:border-white/15 dark:hover:bg-white/10"
              >
                Nicht wirklich
              </button>
            </>
          )}

          <button
            onClick={report}
            disabled={reported}
            className="ml-auto text-xs opacity-50 hover:opacity-80 disabled:opacity-40"
          >
            {reported ? "Gemeldet" : "Brief melden"}
          </button>
        </div>
      </div>
    </div>
  );
}
