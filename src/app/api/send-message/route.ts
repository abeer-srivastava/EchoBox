import dbConnection from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request:Request) {
    await dbConnection();
    const {username,content}=await request.json()
    try {
        const user=await UserModel.findOne({username});
        if(!user){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:404});
        }
        // is the user is accepting the messages
        if(!user.isAcceptingMessages){
            return Response.json({
                success:false,
                message:"User is not accepting messages"
            },{status:403});
        }
        // crafting the new content

        const newMessage={content,createdAt:new Date()};
        user.messages.push(newMessage as Message)
        await user.save();
        return Response.json({
            success:true,
            message:"Message sent Successfully",
        },{status:200});
        
    } catch (error) {
        console.log("error occured during the adding of message",error);
        return Response.json({
            success:false,
            message:"error occured during the adding of message"
        },{status:500});
    }

}