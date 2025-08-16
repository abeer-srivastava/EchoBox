import dbConnection from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import { success } from "zod";
import mongoose from "mongoose";

export async function GET(request:Request) {
        const session=await getServerSession(authOptions);
        const user=session?.user;
        if(!session || !session.user){
            return Response.json({
                success:false,
                message:"User Not Authenticated"
            },{status:401});
        }
        const userId = new mongoose.Types.ObjectId(String(user._id)); //TODO:Check
        try {
            const user=await UserModel.aggregate([
                {$match:{id:userId}},
                {$unwind:'$messages'},
                {$sort:{'messages.createdAt':-1}},
                {$group:{_id:'$_id',messages:{$push:'$messages'}}}
            ])
            if(!user || user.length===0){
                return Response.json({
                    success:false,
                    message:"user not found"
                },{status:401})
            }
            return Response.json({
                success:true,
                messages:user[0].messages
            },{status:200})
        } catch (error) {
            console.log("unexpected error ",error)
            return Response.json({
                success:false,
                message:"unexpected  error"
            },{status:500});
        }
}