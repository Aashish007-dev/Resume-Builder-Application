import { getCurrentUser } from "@/lib/getCurrentUser";
import { connectToDB } from "@/lib/mongodb";
import resumeModel from "@/models/resume.model";
import { APIResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const user = await getCurrentUser();

    const resumes = await resumeModel
      .find({ user_id: user.userId })
      .sort({ createdAt: -1 });

    return NextResponse.json<APIResponse>({
      success: true,
      message: "Resumes fetched successfully",
      data: resumes,
    }, {
      status: 200,
    });

  } catch (error) {
    console.log("Error in get resumes api:", error);

    return NextResponse.json<APIResponse>(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}