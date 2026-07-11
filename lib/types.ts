export type LetterStatus = "pending" | "approved" | "rejected" | "flagged";

/** Was Besucher öffentlich zu sehen bekommen – bewusst minimal, ohne Status/Zähler. */
export interface PublicLetter {
  id: string;
  content: string;
  author_alias: string | null;
  tags: string[];
  created_at: string;
}

/** Vollbild für den Admin-/Moderationsbereich. */
export interface AdminLetter extends PublicLetter {
  status: LetterStatus;
  language: string;
  times_delivered: number;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

export interface AdminReport {
  id: string;
  letter_id: string;
  reason: string | null;
  created_at: string;
  resolved: boolean;
}

export type Reaction = "helped" | "no_help" | "none";
export type MoodChange =
  | "much_better"
  | "better"
  | "no_change"
  | "worse"
  | "much_worse";
