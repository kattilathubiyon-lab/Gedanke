"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Stellt sicher, dass ein angemeldeter Admin agiert. Gibt den Client und die
 * User-ID zurück oder leitet zum Login um. Die eigentliche Autorisierung wird
 * zusätzlich durch die RLS-Policies auf Datenbankebene erzwungen.
 */
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) redirect("/admin/login?error=forbidden");

  return { supabase, userId: user.id };
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect("/admin/login?error=credentials");
  }
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

const STATUS_BY_ACTION: Record<string, "approved" | "rejected" | "flagged"> = {
  approve: "approved",
  reject: "rejected",
  flag: "flagged",
};

/** Freigeben / Ablehnen / Markieren eines Briefs – nur durch Admins. */
export async function moderateLetter(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const action = String(formData.get("action") ?? "");
  const status = STATUS_BY_ACTION[action];
  if (!id || !status) return;

  const { supabase, userId } = await requireAdmin();
  await supabase
    .from("letters")
    .update({
      status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: userId,
    })
    .eq("id", id);

  revalidatePath("/admin");
}

/** Eine Meldung als erledigt markieren. */
export async function resolveReport(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const { supabase } = await requireAdmin();
  await supabase.from("reports").update({ resolved: true }).eq("id", id);

  revalidatePath("/admin");
}
