import { generateAIContent } from "@/lib/gemini";
import { AtsScoreBody } from "@/types/ai.types";
import { APIResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: AtsScoreBody = await req.json();

    const { resumeText } = body;

    if (!resumeText)
      return NextResponse.json<APIResponse>(
        {
          success: false,
          message: "Missing fields",
        },
        { status: 400 },
      );

    const prompt = `
You are an expert ATS (Applicant Tracking System) analyst and technical recruiter.

TASK:
Analyze the resume text below and give an ATS compatibility score with clear feedback.

RESUME TEXT:
${resumeText}

SCORING CRITERIA (total 100):
1. Sections (20): has contact info, summary, skills, work experience or projects, and education.
2. Keywords (25): relevant technical skills and industry keywords for the candidate's target role, using standard ATS-recognized names.
3. Content Quality (25): strong action verbs, clear and specific bullet points, achievements or measurable impact where available.
4. Formatting (15): clean structure, consistent style, no tables, columns, or special characters that break ATS parsing, and a reasonable length.
5. Grammar and Clarity (15): correct spelling, grammar, and concise professional wording.

RULES:
1. Score only what is present in the resume text. Do not assume or invent missing information.
2. Be strict and realistic. A fresher resume with no metrics and a weak summary should not score above 80. Do not give inflated scores.
3. The overall score must equal the sum of the five category scores.
4. Give 3 to 5 strengths and 3 to 6 improvements. Each item must be one specific, actionable sentence of 10 to 25 words. No generic advice like "improve your resume".
5. List missing sections and missing keywords only if they are truly absent. Suggest at most 8 keywords, using official names such as "REST APIs", "Git", "MongoDB".
6. Do not rewrite the resume. Do not use first-person pronouns.
7. If the text is empty or is not a resume, return a score of 0 with an empty breakdown and one improvement saying "Please provide valid resume text".
8. Output ONLY a raw JSON object. No code fences, no explanation, no extra text.

OUTPUT FORMAT:
{
  "score": 0,
  "breakdown": {
    "sections": 0,
    "keywords": 0,
    "contentQuality": 0,
    "formatting": 0,
    "grammarAndClarity": 0
  },
  "strengths": ["..."],
  "improvements": ["..."],
  "missingSections": ["..."],
  "missingKeywords": ["..."]
}

Return the JSON object now.
`;


      const result = await generateAIContent(prompt);

      const AtsScore = result;

      return NextResponse.json<APIResponse>({
        success: true,
        message: "improvedContent created",
        data: {AtsScore}
      }, {status: 201})


  } catch (error) {
    console.log("Error in Generate AtsScore Api", error);
    return NextResponse.json<APIResponse>(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
