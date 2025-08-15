import dbConnection from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/emailVerification";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req:NextRequest){
    await dbConnection();
    try {
        const {username,password,email}=await req.json();
        console.log(username,password,email);
        const existingUserVerifiedByUsername=await UserModel.findOne({
            username,
            isVerified:true,
        });
        if(existingUserVerifiedByUsername){
            return NextResponse.json({
                success:false,
                message:"Username is already taken",
            },{status:400});
        }

        const existingUserByEmail=await UserModel.findOne({
            email
        });
        const verifyCode=Math.floor(100000+Math.random()*90000).toString();
        
        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return NextResponse.json({
                    success:true,
                    message:"User already exist with this email"
                })
            }
            else{
                const hashedPassword=await bcrypt.hash(password,10);
                existingUserByEmail.password=hashedPassword;
                existingUserByEmail.verifyCode=verifyCode;
                existingUserByEmail.verifyCodeExpiry=new Date(Date.now()+3600000);
                await existingUserByEmail.save()
            }
        }
        else{
            const hashedPassword=await bcrypt.hash(password,10);
            const expiryDate=new Date();
            expiryDate.setHours(expiryDate.getHours()+1);
            const newUser=new UserModel({
                    username,
                    password:hashedPassword,
                    email,
                    verifyCode:verifyCode,
                    verifyCodeExpiry:expiryDate,
                    isVerified:false,
                    isAccepting:true,
                    messages:[]
                })
                await newUser.save();
            }
            console.log(email,username,verifyCode)
        const emailResponse=await sendVerificationEmail(
            email,
            username,
            verifyCode
        );
        if(!emailResponse.success){
            return NextResponse.json({
                success:false,
                message:emailResponse.message
            },{status:500});
        }

        return NextResponse.json({
                success:true,
                message:emailResponse.message
            },{status:201});

    } catch (error) {
        console.error("Error while Registering the User",error);
        NextResponse.json(
            {
            success:false,
            message:"Error registering user",
            },
            {
                status:500,
            }
        )}
}