import dbConnection from "@/lib/dbConnect";
import UserModel, { User as MongooseUser } from "@/model/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function GET() {
  await dbConnection();
  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "User is Not Authenticated" },
      { status: 401 }
    );
  }

  try {
    const foundUser = await UserModel.findById(user._id).select("-password");
    if (!foundUser) {
      return Response.json(
        { success: false, message: "User Not Found" },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Account settings fetched successfully",
        username: foundUser.username,
        email: foundUser.email,
        isAcceptingMessages: foundUser.isAcceptingMessages,
        privacyType: foundUser.privacyType || 'anonymous-only',
        hiddenWords: foundUser.hiddenWords || [],
        pauseUntil: foundUser.pauseUntil,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching account settings:", error);
    return Response.json(
      { success: false, message: "Error in fetching account settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await dbConnection();
  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "User is Not Authenticated" },
      { status: 401 }
    );
  }

  const { username, isAcceptingMessages, privacyType, hiddenWords, pauseUntil } = await request.json();

  try {
    const updateData: Partial<MongooseUser> = {};
    if (username !== undefined) {
      // Check if username is already taken if changing it
      const existingUser = await UserModel.findOne({ username });
      if (existingUser && String(existingUser._id) !== String(user._id)) {
        return Response.json(
          { success: false, message: "Username is already taken" },
          { status: 400 }
        );
      }
      updateData.username = username;
    }
    if (isAcceptingMessages !== undefined) updateData.isAcceptingMessages = isAcceptingMessages;
    if (privacyType !== undefined) updateData.privacyType = privacyType;
    if (hiddenWords !== undefined) updateData.hiddenWords = hiddenWords;
    if (pauseUntil !== undefined) updateData.pauseUntil = pauseUntil;

    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        { success: false, message: "Failed to update account settings" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Account settings updated successfully", data: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating account settings:", error);
    return Response.json(
      { success: false, message: "Error in updating account settings" },
      { status: 500 }
    );
  }
}
