import { IResume } from "@/types/resume.types";
import mongoose from "mongoose";



const resumeSchema = new mongoose.Schema<IResume>({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        default: ''
    },
    summary: {
        type: String,
        default: ''
    },

});