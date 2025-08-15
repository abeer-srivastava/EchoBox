import { resend } from "@/lib/sendVerificationEmail";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { email } from "zod";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string,
):Promise<ApiResponse>{
    try {

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: 'Mystery-Message | Verification Email',
        react: VerificationEmail({username,otp:verifyCode}),
});
         return {
            success:true,
            message:"Verification Email send Successfully"
        }
    } catch (emailError) {
        console.log(emailError);
        return {

            success:false,
            message:"failed to send verification email"
        }
    }
}

