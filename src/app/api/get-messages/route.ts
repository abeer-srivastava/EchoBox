import dbConnection from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";

import mongoose from "mongoose";

export async function GET(request:Request) {
        await dbConnection();
        const session = await getServerSession(authOptions)
        // console.log("here are the sessions that needs to be corrected ======",session);
        const user=session?.user;
        // console.log("User session -----------",user)
        if(!session || !session.user){
            return Response.json({
                success:false,
                message:"User Not Authenticated"
            },{status:401});
        }
        const userId = new mongoose.Types.ObjectId(String(user._id)); //TODO:Check
        try {


            // the user aggretion changed from this to the working aggretion currently.  
            // const user = await UserModel.aggregate([
            //     { $match: { _id: userId } },
            //     { $unwind: "$messages" },
            //     { $sort: { "messages.createdAt": -1 } },
            //     { $group: { _id: "$_id", messages: { $push: "$messages" } } }
            // ]);
            const user = await UserModel.aggregate([
                { $match: { _id: userId } },
                {
                    $project: {
                        messages: {
                            $sortArray: { input: "$messages", sortBy: { createdAt: -1 } }
                        }
                    }
                },
                
            ]);
            // console.log("User inside the getmessage api inside the try ",user);
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