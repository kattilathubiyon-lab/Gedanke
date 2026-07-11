"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const MIN_LENGTH = 20;
const MAX_LENGTH = 5000;
const MAX_ALIAS = 60;

/**
 * Nimmt einen eingereichten Brief entgegen. Der Brief wird IMMER mit
 * status = 'pending' gespeichert und NIE automatisch veröffentlicht – die
 * RLS-Policy erzwingt dies zusätzlich auf Datenbankebene.
 */
export async function submitLetter(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect("/schreiben?error=not_configured");
  }

  const content = String(formData.get("content") ?? "").trim();
  const aliasRaw = String(formData.get("author_alias") ?? "").trim();
  const author_alias = aliasRaw.length > 0 ? aliasRaw.slice(0, MAX_ALIAS) : null;

  if (content.length < MIN_LENGTH) {
    redirect("/schreiben?error=zu_kurz");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("letters").insert({
    content: content.slice(0, MAX_LENGTH),
    author_alias,
    language: "de",
    status: "pending", // wird NIE automatisch veröffentlicht
  });

  if (error) {
    redirect("/schreiben?error=fehler");
  }

  redirect("/danke");
}
