import { generateAIContent } from "@/lib/gemini";
import { ImproveContentBody } from "@/types/ai.types";
import { APIResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: ImproveContentBody = await req.json();

    const { content } = body;

    if (!content)
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
Improve the resume content below and make it professional and ATS-friendly.

ORIGINAL CONTENT:
${content}

RULES:
1. Output ONLY the improved content as plain text. No JSON, no quotation marks, no markdown, no asterisks, no heading, no label, no explanation, no notes about what you changed.
2. Keep the same meaning and facts. Do not add new skills, tools, companies, projects, metrics, percentages, or achievements that are not in the original. If the original has numbers, keep them exactly as written.
3. Detect the type of content (summary, skills, project description, work experience, education, certification, or other) and keep the same type and structure.
4. If the original has multiple lines or points, keep the same number of lines, each on its own line separated by a single line break. Do not add bullet symbols, dashes, or numbering.
5. For summaries, keep it a single paragraph. For skills, keep them as a comma-separated list using official ATS-recognized names, e.g. "React.js", "Node.js", "MongoDB".
6. For experience and project points, start each line with a strong past-tense action verb and keep each line to 15 to 25 words.
7. Fix grammar, spelling, and punctuation. Remove filler words, repetition, and vague phrases.
8. Use clear, concise, professional wording with relevant industry keywords already implied by the content.
9. Do not use first-person pronouns (I, my, we). Do not use clichés like "hard-working", "team player", "passionate", "results-driven", or "responsible for".
10. Keep the length close to the original. Do not make it much longer.
11. If the original is empty, meaningless, or not resume-related, return exactly: INVALID_CONTENT

Return the improved content now.
`;


      const result = await generateAIContent(prompt);

      const improvedContent = result;

      return NextResponse.json<APIResponse>({
        success: true,
        message: "improvedContent created",
        data: {improvedContent}
      }, {status: 201})


  } catch (error) {
    console.log("Error in Generate improvedContent Api", error);
    return NextResponse.json<APIResponse>(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
