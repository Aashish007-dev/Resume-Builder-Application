import { generateAIContent } from "@/lib/gemini";
import { GenerateSkillsBody } from "@/types/ai.types";
import { APIResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: GenerateSkillsBody = await req.json();

    const { experienceLevel, jobTitle } = body;

    if (!experienceLevel || !jobTitle)
      return NextResponse.json<APIResponse>(
        {
          success: false,
          message: "Missing fields",
        },
        { status: 400 },
      );

    const prompt = `
You are an expert technical recruiter who specializes in ATS-optimized resumes.

TASK:
Generate relevant TECHNICAL skills for the candidate below.

CANDIDATE DETAILS:
- Job Title: ${jobTitle}
- Experience Level: ${experienceLevel}

RULES:
1. Output ONLY a raw JSON array of strings, starting with [ and ending with ]. No object wrapper, no key name, no code fences, no explanation, no extra text.
2. Do NOT wrap the array in quotes and do NOT escape any characters.
3. Return 12 to 15 skills, ordered from most to least important for the job title.
4. Include ONLY technical skills: languages, frameworks, libraries, databases, tools, and platforms. No soft skills.
5. Use official, ATS-recognized names, e.g. "React.js", "Node.js", "MongoDB", "REST APIs".
6. Each item must be one skill of 1 to 3 words. No duplicates.
7. Match depth to the experience level: fundamentals for Fresher/Entry-level, plus testing and deployment for Mid-level, plus architecture, DevOps, and cloud for Senior.

EXAMPLE OUTPUT:
["JavaScript", "React.js", "Node.js", "MongoDB"]
`;


      const result = await generateAIContent(prompt);

      let skills = result;

      if(typeof skills === "string"){
        try {
            skills = JSON.parse(skills);
        } catch (error) {
            console.log("Failed to parse skills: ", error)
        }
      }
      

      return NextResponse.json<APIResponse>({
        success: true,
        message: "Skills created",
        data: {skills}
      }, {status: 201})


  } catch (error) {
    console.log("Error in Generate skills Api", error);
    return NextResponse.json<APIResponse>(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
