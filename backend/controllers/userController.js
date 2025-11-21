import mongoose from "mongoose";
import User from "../models/userModel.js";
import validator from 'validator';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

const TOKEN_EXPIRES_IN  = '24H';
const JWT_SECRET = process.env.MY_JWT_SECRET;


// REGISTER
export async function register(req,res){
    try{
        const {name, email,password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                success:false,
                message:"Bad Request, All Fields are Required"
            })
        }

        if(!validator.isEmail(email)){
            return res.status(400).json({
                success:false,
                messge:"Invalid Email"
            })
        }

        const exists = await User.findOne({email})
        if(exists){
            return res.status(409).json({
                success:false,
                message:"User Already Exists"
            })
        }

        const newId = new mongoose.Types.ObjectId();
        const hashedPassword = await bcrypt.hash(password,10);

        const user = new User({
            _id:newId,
            name,
            email,
            password : hashedPassword
        });
        await user.save();

        if(!JWT_SECRET) throw new Error("JWT_SECRET is not found on server");
        const token = jwt.sign({id:newId.toString()},JWT_SECRET,{expiresIn:TOKEN_EXPIRES_IN});
        return res.status(201).json({
            success:true,
            message:"Account Created Successfully",
            token,
            user:{id:user._id.toString(), name:user.name, email:user.email}
        });

    }catch(error){
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Server Error"    
        })
    }
}


// login function

export async function login(req,res){
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All Fields are required."
            });
        }

        const user = await User.findOne({email: email});
        if(!user){
            return req.status(401).json({
                success:false,
                message:"Invalid Email or Password"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({
                success:false,
                message:"Invalid Email or Password"
            });
        }

        const token = jwt.sign({id:user._id.toString()}, JWT_SECRET, {expiresIn:TOKEN_EXPIRES_IN});

        return res.status(200).json({
            success:true,
            message:"Logged In Successfully",
            token,
            user:{id:user._id.toString(),name: user.name, email:user.email}
        })

    }catch(error){
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Server Error"    
        })
    }
}