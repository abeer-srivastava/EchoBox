import dbConnection from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnection();

  try {
    const { username, code } = await request.json();
    console.log("Code received:", code);
    console.log("Username received:", username);

    const decodedUsername = decodeURIComponent(username);
    console.log("Decoded username:", decodedUsername);

    const user = await UserModel.findOne({
      username: decodedUsername
    });

    if (!user) {
      return Response.json({
        success: false,
        message: "User not found"
      }, { status: 404 });
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    console.log("Code valid:", isCodeValid);
    console.log("Code not expired:", isCodeNotExpired);
    console.log("Stored code:", user.verifyCode);
    console.log("Provided code:", code);

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json({
        success: true,
        message: "Account verified successfully"
      }, { status: 200 });
    } else if (!isCodeNotExpired) {
      return Response.json({
        success: false,
        message: "Verification code has expired. Please sign up again to get a new code."
      }, { status: 400 });
    } else {
      return Response.json({
        success: false,
        message: "Incorrect verification code"
      }, { status: 400 });
    }

  } catch (error) {
    console.error("Error verifying user:", error);
    return Response.json({
      success: false,
      message: "Error verifying user"
    }, { status: 500 });
  }
}
