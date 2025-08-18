import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import dbConnection from "@/lib/dbConnect";
import { User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
export async function DELETE(request:Request,{params}:{params:{messageid:string}}){

    const messageid=params.messageid;
    await dbConnection();
    const session =await getServerSession(authOptions);
    const _user:User=session?.user;
    if(!session || !_user){
        return Response.json({
            success:false,
            message:"Not Authenticated",
        },{status:401});
    }
    try {
       const updateResult=await UserModel.updateOne(
        {_id:_user._id},
        {$pull:{messages:{_id:messageid}}}
    );
    if(updateResult.modifiedCount===0){
        return Response.json({
            message:"Message not Found or already deleted",
        },{status:404});
    } 
    return Response.json({
        message:"Message deleted",success:true
    },{status:200});
    } catch (error) {
        console.error("Error occured during the Deletion of messages",error);
        return Response.json({
            message:"Error deleting message",
        },{status:500}
        );
    }
}