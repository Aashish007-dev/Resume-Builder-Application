import { generateAIContent } from "@/lib/gemini";
import { GenerateProjectDescriptionBody } from "@/types/ai.types";
import { APIResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: GenerateProjectDescriptionBody = await req.json();

    const { experienceLevel, jobTitle, techStack } = body;

    if (!experienceLevel || !jobTitle || !techStack)
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
Write the description for ONE resume project using only the details below.

CANDIDATE DETAILS:
- Job Title: ${jobTitle}
- Tech Stack Used in the Project: ${techStack}
- Experience Level: ${experienceLevel}

RULES:
1. Output ONLY plain text. No JSON, no square brackets, no quotation marks, no markdown, no asterisks, no heading, no label, no explanation.
2. Write exactly 3 to 4 sentences, each on its own line, separated by a single line break. Do not add bullet symbols, dashes, or numbering.
3. Each sentence must be 15 to 25 words.
4. Start every sentence with a different strong past-tense action verb, e.g. Built, Developed, Designed, Implemented, Integrated, Optimized.
5. Naturally include the provided tech stack keywords exactly as written. Do not mention any technology that was not provided.
6. Describe realistic, typical work a ${jobTitle} would do with this tech stack: features built, APIs or UI developed, data handling, and the value delivered.
7. Keep the wording general. Do not invent a project name, company, client, metrics, percentages, user counts, or deployment claims.
8. Do not use first-person pronouns (I, my, we). Do not use clichés like "hard-working", "passionate", or "results-driven".
9. Match the tone to the experience level: for Fresher/Entry-level, focus on hands-on implementation and technical skills; for Mid-level and Senior, focus on ownership, architecture, and impact.

EXAMPLE OUTPUT FORMAT:
Developed a responsive web application using React.js and Tailwind CSS with reusable components and clean state management.
Built RESTful APIs with Node.js and Express.js to handle authentication and data operations.

Return the description now.
`;

    const result = await generateAIContent(prompt);

    const projectDescription = result;

    return NextResponse.json<APIResponse>(
      {
        success: true,
        message: "projectDescription created",
        data: { projectDescription },
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("Error in Generate project Description Api", error);
    return NextResponse.json<APIResponse>(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
