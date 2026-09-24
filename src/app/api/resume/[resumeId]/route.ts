import { getCurrentUser } from "@/lib/getCurrentUser";
import { connectToDB } from "@/lib/mongodb";
import resumeModel from "@/models/resume.model";
import { APIResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function GET (req: NextRequest, {params}: {params: Promise<{resumeId: string}>}) {
    try {
        await connectToDB();

        const user = await getCurrentUser();

        const {resumeId} = await params;

        const resume = await resumeModel.findOne({_id: resumeId, user_id: user.userId});

        if(!resume) return NextResponse.json<APIResponse>({
            success: false,
            message: "Resume not found"
        }, {status: 404});

        return NextResponse.json<APIResponse>({
            success: true,
            message: "Resume fetched successfully",
            data: resume
        }, {status: 200})
        
    } catch (error) {
        console.log("Error in Get resume api", error);
        return NextResponse.json<APIResponse>(
              {
                success: false,
                message: "Something went wrong",
              },
              { status: 500 },
            );
    }
};


export async function PATCH (req: NextRequest, {params}: {params: Promise<{resumeId: string}>}) {
    try {
        await connectToDB();

        const user = await getCurrentUser();

        const body = await req.json();

        const {resumeId} = await params;

        const updatedResume = await resumeModel.findOneAndUpdate({
            _id: resumeId,
            user_id: user.userId
        }, {
            $set: body,
        }, {
            new: true,
            runValidators: true
        });

        if(!updatedResume) return NextResponse.json<APIResponse>({
            success: false,
            message: "updatedResume failed to update"
        }, {status: 400});

        return NextResponse.json<APIResponse>({
            success: true,
            message: "Resume updated successfully",
            data: updatedResume
        }, {status: 200})
        
    } catch (error) {
        console.log("Error in updated Resume api", error);
        return NextResponse.json<APIResponse>(
              {
                success: false,
                message: "Something went wrong",
              },
              { status: 500 },
            );
    }
}