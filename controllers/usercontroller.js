import userModel from "../models/usermodels.js";
import auth from "../common/auth.js";
import nodemailer from "nodemailer";
import smtpTransport from 'nodemailer-smtp-transport';
import dotenv from "dotenv";
import { sign } from "crypto";

dotenv.config();

const signup=async(req,res)=>{
    try{
        const {firstName,lastName, email, password} = req.body;
        console.log(firstName,lastName,email,password);
        if(!firstName || !lastName || !email || !password){
            return res.status(400).json({
                message:"All Fields required"
            })
        }

        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.status(400).json({meesage:"Email is already registered"});
        }

        const hashPassword = await auth.hashPassword(password);
        const newUser = new userModel({
            firstName,
            lastName,
            email,
            password:hashPassword,
        });

        await newUser.save();
        res.status(201).json({message:"User registered successfully"});
    }catch(error){
        console.log(error);
        res.status(500).json({
            message:"Internal Servor Error"
        })
    }
};

const signin = async (req,res)=>{
    try{
        const {email,password}=req.body;
        const user = await userModel.findOne({email});

        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        if(!user.password){
            return res.status(401).json({message:"Invalid credentials"});
        }

        const isPasswordValid = await auth.hashCompare(password,user.password);
        if(!isPasswordValid){
            return res.status(401).json({
                message:"Invalid password"
            });
        }

        const token = await auth.createToken({
            id:user._id,
            firstName:user.firstName,
            lastName:user.lastName,
            email:user.email,
            role:user.role,
        }, "15d");

        let userData = await userModel.findOne(
            {email:req.body.email},
            {_id:0,password:0,status:0,createdAt:0,email:0}
        );
        res.status(200).json({message:"Signin successful",token,userData});
    }catch(error){
        console.error(error);
        res.status(500).json({message:"Internal Servor Error"})
    }
};

const forgotPassword = async (req,res)=>{
    const {email} = req.body;
    try{
       const user=await userModel.findOne({email});
       if(!user){
        return res.status(404).json({message:"User not found"});
       }

       const generateOTP=()=>{
        const characters = "0123456789";
        return Array.from(
            {length:6},
            ()=> characters[Math.floor(Math.random() * characters.length)]
        ).join("");
       };
       
       const OTP = generateOTP();
       user.resetPasswordOtp = OTP;
       user.resetpasswordExpires = Date.now() + 3600000;
       await user.save();
       console.log(OTP);

       const transporter = nodemailer.createTransport(
        smtpTransport({ 
        host:"smtp.elasticemail.com",
        port:2525,
        auth:{
            user:process.env.USER_MAILER,
            pass:process.env.PASS_MAILER
        },
    })
       );

       const mailOptions={
        from:"gmurugalakshmi1991@outlook.com",
        to:user.email,
        subject:"Password Reset",
        html:`<p>Dear ${user.firstName} ${user.lastName},</p>
              <p>We received a request to reset your password. Here is your One-Time Password(OTP):<strong>${OTP}</stron></p>
              <p>Please click the following link to reset your password:</p>
              <a href="http://localhost:5173/reset-password">Reset Password</a>
              <p>If you did not make this request, please ignore this email </p>
              <p>Thank you</p>
              <p>From Validation</p>`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({message:"Password reset email sent successfully"});
    }catch(error){
      console.error(error);
      res.status(500).json({
        meesage:"Internal Servor Error",
        error:error.message,
      });
    }
};

const resetPassword = async (req,res)=>{
    try{
       const {OTP,password}=req.body;
       const user = await userModel.findOne({
        resetPasswordOtp:OTP,
        resetpasswordExpires:{$gt:Date.now()},
       });

       if(!user){
        const message = user?"OTP has expired":"Invalid OTP";
        return res.status(404).json({message});
       }

        const hashPassword = await auth.hashPassword(password);
        user.password=hashPassword;
        user.resetPasswordOtp=null;
        user.resetpasswordExpires=null;

        await user.save();
        res.status(200).json({message:"Password changed successfully"});
    }catch(error){
        console.error(error);
        res.status(500).json({message:"Internal Server Error"})
    }
};

export default{
    signup,
    signin,
    resetPassword,
    forgotPassword,
};