import { NextResponse, type NextRequest } from "next/server";
import { deliverRandomLetter } from "@/lib/delivery";

/** Liefert den nächsten zufälligen freigegebenen Brief (für „weiteren lesen"). */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const exclude: string[] = Array.isArray(body?.exclude)
    ? body.exclude.filter((x: unknown): x is string => typeof x === "string")
    : [];

  const letter = await deliverRandomLetter(exclude);
  return NextResponse.json({ letter });
}
