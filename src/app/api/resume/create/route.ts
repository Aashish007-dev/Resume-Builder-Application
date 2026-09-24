import { getCurrentUser } from "@/lib/getCurrentUser";
import { connectToDB } from "@/lib/mongodb";
import resumeModel from "@/models/resume.model";
import { APIResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST (req: NextRequest) {
    try {
        await connectToDB();

        const userId = await getCurrentUser();

        const resume = await resumeModel.create({
            user_id: userId,
            title: "",
            summary: "",
            personalInfo: {},
            workExperience: [],
            projects: [],
            education: [],
            skills: [],
            certifications: []
            
        });

        return NextResponse.json<APIResponse>({
            success: true,
            message: "Resume created successfully",
            data: resume
        }, {status: 201});
    } catch (error) {  
            console.log("Error in create resume Api", error);
            return NextResponse.json<APIResponse>({
                success: false,
                message: "Something went wrong"
            }, {status: 500})
    }
}