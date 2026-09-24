import { generateAIContent } from "@/lib/gemini";
import { GenerateSummaryBody } from "@/types/ai.types";
import { APIResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: GenerateSummaryBody = await req.json();

    const { experienceLevel, skills, jobTitle } = body;

    if (!experienceLevel || !skills || !jobTitle)
      return NextResponse.json<APIResponse>(
        {
          success: false,
          message: "Missing fields",
        },
        { status: 400 },
      );

    const prompt = `
You are an expert resume writer who specializes in ATS-optimized resumes.

TASK:
Write ONE professional resume summary using only the details below.

CANDIDATE DETAILS:
- Job Title: ${jobTitle}
- Skills: ${skills}
- Experience Level: ${experienceLevel}

RULES:
1. Output ONLY the summary text. No title, heading, label, preamble, explanation, or closing remark.
2. Write a single paragraph of 3 to 4 sentences, 50 to 80 words.
3. Use plain text only. No markdown, bullet points, asterisks, emojis, quotation marks, or special characters.
4. Do not use first-person pronouns (I, my, me). Write in implied first person, e.g. "Full-stack developer skilled in...".
5. Start with the job title and experience level, then highlight the most relevant skills.
6. Naturally include the provided skills as keywords exactly as written. Do not add skills that were not provided.
7. Do not invent facts: no fake years of experience, companies, projects, metrics, certifications, or achievements.
8. Match the tone to the experience level:
   - Fresher/Entry-level: focus on skills, hands-on project work, eagerness to learn, and readiness to contribute.
   - Mid-level: focus on proven skills, ownership, and delivering results.
   - Senior: focus on leadership, architecture, and impact.
9. Use strong, professional wording. Avoid clichés like "hard-working", "team player", "passionate", and "results-driven".
10. End with a short value statement about what the candidate brings to an employer.

Return the summary now.
`;


      const result = await generateAIContent(prompt);

      const summary = result;

      return NextResponse.json<APIResponse>({
        success: true,
        message: "Summary created",
        data: {summary}
      }, {status: 201})


  } catch (error) {
    console.log("Error in Generate summary Api", error);
    return NextResponse.json<APIResponse>(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
