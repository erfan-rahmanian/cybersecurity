import { NextRequest, NextResponse } from "next/server";
import { getSeedQuestion } from "@/lib/seedQuestions";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, id } = body as { category: "security+" | "ceh" | "soc"; id: number };

    if (!category || !id || id < 1 || id > 100) {
      return NextResponse.json({ error: "پارامترهای ارسالی نامعتبر هستند" }, { status: 400 });
    }

    const question = getSeedQuestion(category, id);
    return NextResponse.json(question);
  } catch (error: any) {
    console.error("Error fetching question:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
