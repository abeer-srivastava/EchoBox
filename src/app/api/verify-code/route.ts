import dbConnection from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { success } from "zod";

export async function GET(request:Request){
    
    await dbConnection();
     try {
        const {username,code}=await request.json();
        const decodedUsername=decodeURIComponent(username);
        const user=await UserModel.findOne({
            username:decodedUsername
        });
        if(!user){
            Response.json({
                success:false,
                message:"User no found"
            },{
                status:500
            })
        }

        const isCodeValid=user?.verifyCode===code
        const isCodeNotExpiry = new Date(user?.verifyCodeExpiry as Date)>new Date()

        if(isCodeValid && isCodeNotExpiry && user){
            user.isVerified=true;
            await user.save();

            return Response.json({
                success:true,
                message:"Account Verified"
            },{status:200});

        }else if(!isCodeNotExpiry){
            return Response.json({
                success:false,
                message:"Verification Code is Expired please signUp again to get a new code"
            });
        }
        else{
             return Response.json({
                success:false,
                message:"Incorrect Verification Code"
            });
        }

     } catch (error) {
        console.error("error in verifying the user",error);
        Response.json(
            {
            success:false,
            message:"error in verifying the user"
        },{status:500})
     }
}