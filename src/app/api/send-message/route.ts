import dbConnection from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";

export async function POST(request: Request) {
  await dbConnection();
  const { username, content, senderName } = await request.json();
  try {
    const user = await UserModel.findOne({ username }).select("isAcceptingMessages");
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    // is the user is accepting the messages
    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        { status: 403 }
      );
    }

    const newMessage = {
      _id: new mongoose.Types.ObjectId(),
      content,
      senderName: senderName || undefined,
      createdAt: new Date(),
    };

    await UserModel.updateOne(
      { _id: user._id },
      { $push: { messages: newMessage } }
    );

    return Response.json(
      {
        success: true,
        message: "Message sent Successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error occured during the adding of message", error);
    return Response.json(
      {
        success: false,
        message: "error occured during the adding of message",
      },
      { status: 500 }
    );
  }
}