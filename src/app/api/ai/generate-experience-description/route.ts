import { generateAIContent } from "@/lib/gemini";
import { GenerateExperienceDescriptionBody } from "@/types/ai.types";
import { APIResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: GenerateExperienceDescriptionBody = await req.json();

    const { experienceLevel, yearsOfExperience, techStack, jobRole } = body;

    if (!experienceLevel || !yearsOfExperience || !techStack || !jobRole)
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
Write the work experience description for ONE job role using only the details below.

CANDIDATE DETAILS:
- Job Role: ${jobRole}
- Tech Stack / Tools Used: ${techStack}
- Experience Level: ${experienceLevel}
- Years of Experience: ${yearsOfExperience}

RULES:
1. Output ONLY plain text. No JSON, no square brackets, no quotation marks, no markdown, no asterisks, no heading, no label, no explanation.
2. Write exactly 4 to 5 sentences, each on its own line, separated by a single line break. Do not add bullet symbols, dashes, or numbering.
3. Each sentence must be 15 to 25 words.
4. Start every sentence with a different strong past-tense action verb, e.g. Developed, Built, Collaborated, Implemented, Optimized, Debugged, Maintained.
5. Naturally include the provided tech stack keywords exactly as written. Do not mention any technology that was not provided.
6. Describe realistic responsibilities of a ${jobRole}: feature development, clean and maintainable code, API and database work, debugging, code reviews, and teamwork in an Agile environment.
7. Use the years of experience only to set the scope and depth of the responsibilities. Do not write the number of years in the sentences.
8. Keep the wording general. Do not invent a company name, client, project name, metrics, percentages, user counts, or awards.
9. Do not use first-person pronouns (I, my, we). Do not use clichés like "hard-working", "team player", "passionate", or "results-driven".
10. Match scope to experience:
   - Less than 1 year or Fresher: hands-on tasks, learning, and contribution under guidance.
   - 1 to 3 years: independent feature ownership, API and database work, and code reviews.
   - 3 to 5 years: end-to-end module delivery, performance optimization, and mentoring juniors.
   - More than 5 years or Senior: architecture decisions, technical leadership, and cross-team impact.

EXAMPLE OUTPUT FORMAT:
Developed responsive user interfaces using React.js and Tailwind CSS based on design requirements.
Built and integrated RESTful APIs with Node.js and Express.js to support core application features.
Collaborated with team members to debug issues and deliver features on schedule.

Return the description now.
`;

    const result = await generateAIContent(prompt);

    const workExperienceDescription = result;

    return NextResponse.json<APIResponse>(
      {
        success: true,
        message: "workExperienceDescription created",
        data: { workExperienceDescription },
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("Error in Generate work Experience Description Api", error);
    return NextResponse.json<APIResponse>(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
