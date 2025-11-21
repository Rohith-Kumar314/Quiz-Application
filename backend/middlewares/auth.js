import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const JWT_SECRET = process.env.MY_JWT_SECRET;

export default async function authMiddleware(req,res,next) {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(401).json({
            success:false,
            message:'Not authorized, token Missing'
        })
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(payload.id).select('-password'); // -password to tell the mongoose to not include the password in the user object. 
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User not found"
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log('Authentication Error', error);
        console.error("JWT Verification Failed", error.message);

        return res.status(401).json({
            success:false,
            message: "Invalid Token or Token Expired",
        })
    }
}