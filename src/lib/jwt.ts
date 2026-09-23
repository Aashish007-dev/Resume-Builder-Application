import { JWTPayload } from "@/types/user.types"
import  Jwt  from "jsonwebtoken"

export const generateToken = (payload: JWTPayload): string => {
    return Jwt.sign(payload, process.env.JWT_SECRET!, {expiresIn: '1h'})
}


export const verifyToken = (token: string): any => {
     return Jwt.verify(token, process.env.JWT_SECRET!)
}