import { IUser } from "@/types/user.types";
import mongoose from "mongoose";
import bcrypt from "bcrypt";


interface UserDocument extends Omit<IUser, '_id'>, Document {
    comparePassword(candidatePassword: string): boolean
}

const userSchema = new mongoose.Schema<UserDocument>({
    name: {
        type: String,
        trim: true,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        trim: true,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Name is required"],
        minLength: [6, "Minimum 6 character long"]
    },

    mobile: {
        type: String,
        minLength: [10, "min 10 characters required"],
        maxLength: [10, "max 10 characters required"]
    }
}, {timestamps: true});

userSchema.pre('save', function () : void {
    if(!this.isModified('password')) return
    this.password = bcrypt.hashSync(this.password, 10)
});

userSchema.methods.comparePassword = function (candidatePassword: string) : boolean {
    return bcrypt.compareSync(candidatePassword, this.password)
}

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;