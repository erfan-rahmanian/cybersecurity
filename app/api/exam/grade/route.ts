import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { getSeedQuestion, Question } from "@/lib/seedQuestions";

export const dynamic = "force-dynamic";

// Normalized helper function for solid keyword matching
function runLocalGrading(question: Question, userAnswer: string) {
  const rawNormalized = userAnswer.toLowerCase().trim();

  const normalize = (str: string) => {
    return str
      .replace(/ی/g, "ی")
      .replace(/ي/g, "ی")
      .replace(/ک/g, "ک")
      .replace(/ك/g, "ک")
      .replace(/\s+/g, " ")
      .trim();
  };

  const normAnswer = normalize(rawNormalized);
  const keywords = question.keywords || [];

  if (normAnswer.length < 15) {
    return {
      score: 1,
      status: "weak",
      analysis: "پاسخ ارسال‌شده بسیار مختصر و فاقد اطلاعات تحلیلی کافی است. لطفاً حداقل در یک یا دو جمله سناریو را بررسی کنید.",
      strengths: "تلاش اولیه برای نوشتن پاسخ تئوری.",
      weaknesses: "عدم استفاده از اصطلاحات امنیتی و پارامترهای اصلی سناریو.",
    };
  }

  const matched: string[] = [];
  const missing: string[] = [];

  keywords.forEach((kw) => {
    const normKw = normalize(kw.toLowerCase());
    if (normAnswer.includes(normKw)) {
      matched.push(kw);
    } else {
      missing.push(kw);
    }
  });

  const matchedCount = matched.length;
  const totalCount = keywords.length || 1;
  const keywordScore = Math.round((matchedCount / totalCount) * 8);
  const lengthBonus = normAnswer.length > 80 ? 2 : (normAnswer.length > 40 ? 1 : 0);
  const score = Math.max(1, Math.min(10, keywordScore + lengthBonus));

  let status = "weak";
  if (score >= 8) {
    status = "excellent";
  } else if (score >= 4) {
    status = "partial";
  }

  let analysis = "";
  let strengths = "";
  let weaknesses = "";

  if (status === "excellent") {
    analysis = "پاسخ تشریحی شما بسیار کامل، ساختاریافته و با تسلط کامل بر مفاهیم امنیت سایبری و ابزارهای مرتبط نوشته شده است.";
    strengths = `شما به درستی مفاهیم حساس [${matched.join("، ")}] را شرح داده‌اید که ستون اصلی این مبحث است.`;
    weaknesses = "نقطه ضعف عمده‌ای یافت نشد. پاسخ شما نمره کامل و عالی را کسب کرد.";
  } else if (status === "partial") {
    analysis = "پاسخ شما تا حدودی مرتبط است و مفاهیم اولیه را پوشش داده است، اما نیاز به تکمیل جزئیات فنی و اشاره به کلیدواژه‌های مرجع دارد.";
    strengths = matched.length > 0 
      ? `اشاره مناسب به مفاهیم کلیدی [${matched.join("، ")}] که گام مثبتی است.`
      : "ارسال متنی بلند و با ساختار معتبر.";
    weaknesses = missing.length > 0
      ? `عدم اشاره یا کم‌رنگ بودن مفاهیم حائز اهمیتی نظیر [${missing.join("، ")}]. توصیه می‌شود این موارد را تحلیل کنید.`
      : "جزئیات فنی پاسخ نیاز به ارتقا دارد.";
  } else {
    analysis = "پاسخ ارسال شده ضعیف است و شامل مفاهیم حاکمیتی و کلیدی خواسته شده در سوال نمی‌گردد.";
    strengths = matched.length > 0 
      ? `شناسایی مقدماتی کلمه [${matched.join("، ")}].`
      : "ثبت پاسخ متنی برای سوال.";
    weaknesses = `عدم اشاره به پایه‌ای ترین اصطلاحات مورد انتظار مانند [${missing.join("، ")}]. پیشنهاد می‌شود پاسخ کامل مرجع را به دقت مطالعه کنید.`;
  }

  return {
    score,
    status,
    analysis,
    strengths,
    weaknesses,
  };
}

export async function POST(req: NextRequest) {
  let question: Question | null = null;
  try {
    const body = await req.json();
    const { userAnswer, category, id } = body as {
      userAnswer: string;
      category: "security+" | "ceh" | "soc";
      id: number;
    };

    if (!userAnswer || !category || !id) {
      return NextResponse.json({ error: "پارامترهای ارسالی نامعتبر هستند" }, { status: 400 });
    }

    question = getSeedQuestion(category, id, "essay");
    const keywords = question.keywords || [];

    let score = 5;
    let status = "partial";
    let analysis = "";
    let strengths = "";
    let weaknesses = "";

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey: apiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            },
          },
        });

        const userPrompt = `
Question (صورت سوال):
${question.questionText}

Syllabus/Topic (موضوع):
${question.syllabusTopic}

Reference Correct Answer/Explanation (پاسخ مرجع):
${question.explanation}

Expected Keywords (کلیدواژه‌های کلیدی):
${keywords.join(", ")}

User's response to grade (پاسخ تشریحی کاربر):
"${userAnswer}"
`;

        const responseList = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: userPrompt,
          config: {
            systemInstruction: `You are an expert Cyber Security Instructor and Lead Evaluator grading professional certificate exam essay responses (Security+, CEH, SOC).
Grade the user's answer out of 10 based on accuracy, alignment with the question, correct use of technical concepts, and coverage of the target keywords listed in the input.
Your overall output must be a single structured JSON object conforming precisely to the specified schema, containing the keys: "score", "status", "analysis", "strengths", "weaknesses".
All text feedback (analysis, strengths, weaknesses) must be written in fluent, grammatically correct, and helpful Persian (Farsi). Do not use any English unless citing technical terms.`,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                score: {
                  type: Type.INTEGER,
                  description: "Final score from 1 to 10.",
                },
                status: {
                  type: Type.STRING,
                  description: "One of: 'weak' (score 1-3), 'partial' (score 4-7), or 'excellent' (score 8-10).",
                },
                analysis: {
                  type: Type.STRING,
                  description: "A summary analysis explaining the grade decision in Persian.",
                },
                strengths: {
                  type: Type.STRING,
                  description: "Specific strengths identified in the user's answer in Persian.",
                },
                weaknesses: {
                  type: Type.STRING,
                  description: "Missing technical details/keywords or areas of improvement in Persian.",
                },
              },
              required: ["score", "status", "analysis", "strengths", "weaknesses"],
            },
          },
        });

        const textResponse = responseList.text?.trim() || "{}";
        const parsed = JSON.parse(textResponse);
        score = typeof parsed.score === "number" ? parsed.score : 5;
        status = parsed.status || "partial";
        analysis = parsed.analysis || "پاسخ با موفقیت به صورت خودکار ارزیابی شد.";
        strengths = parsed.strengths || "رعایت مفاهیم پرسش به صورت نسبی.";
        weaknesses = parsed.weaknesses || "نیاز به اضافه کردن پارامترها و ابزارهای مرتبط با موضوع.";
      } catch (geminiErr) {
        console.error("Gemini grading failed, falling back to local deterministic engine:", geminiErr);
        const localGrading = runLocalGrading(question, userAnswer);
        score = localGrading.score;
        status = localGrading.status;
        analysis = localGrading.analysis;
        strengths = localGrading.strengths;
        weaknesses = localGrading.weaknesses;
      }
    } else {
      console.warn("GEMINI_API_KEY not found. Running local deterministic grading engine.");
      const localGrading = runLocalGrading(question, userAnswer);
      score = localGrading.score;
      status = localGrading.status;
      analysis = localGrading.analysis;
      strengths = localGrading.strengths;
      weaknesses = localGrading.weaknesses;
    }

    return NextResponse.json({
      score,
      status,
      analysis,
      strengths,
      weaknesses,
      suggestedAnswer: question.explanation,
    });
  } catch (error: any) {
    console.error("Fatal error grading answer:", error);
    const backupExplanation = question ? question.explanation : "پاسخ مرجع به زودی بارگذاری می‌شود.";
    return NextResponse.json({
      score: 5,
      status: "partial",
      analysis: "خطا در ارزیابی سرور محلی پاسخ.",
      strengths: "ثبت پاسخ در سابقه محلی شما انجام شد.",
      weaknesses: "مکانیزم تحلیل کلیدواژه‌ها موقتاً با خطا مواجه شد.",
      suggestedAnswer: backupExplanation,
    });
  }
}
