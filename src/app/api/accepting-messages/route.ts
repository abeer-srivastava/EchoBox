import dbConnection from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

// currently loggedIn user toggle the accepting messages
export async function POST(request: Request) {
  await dbConnection();

  const session = await getServerSession(authOptions);
  console.log("session in accepting route --------------",session);
  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "User is Not Authenticated",
      },
      { status: 400 }
    );
  }
  const userId = user._id;
  const { acceptMessage } = await request.json();
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessage },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "failed to update the user status to accept Messages",
        },
        { status: 401 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "message Acceptance status updated Successfully",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to update User status to accept messages", error);
    return Response.json({
      success: false,
      message: "failed to update User status to accept message",
    });
  }
}
export async function GET(request: Request) {
  await dbConnection();
  try {
    const session = await getServerSession(authOptions);
    const user: User = session?.user;

    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          message: "User is Not Authenticated",
        },
        { status: 400 }
      );
    }
    const userId = user._id;
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User Not Found",
        },
        { status: 404 }
      );
    }
    return Response.json({
      success: true,
      isAcceptingMessages: foundUser.isAcceptingMessages,
    },{status:200});
  } catch (error) {
    console.log("Error in Getting Message Acceptance Status", error);
    return Response.json({
      success: false,
      message: "Error in Getting Message Acceptance Status",
    }); 
  }
}
