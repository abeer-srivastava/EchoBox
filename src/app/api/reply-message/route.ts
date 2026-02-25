import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import dbConnection from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function POST(request: Request) {
  await dbConnection();
  const session = await getServerSession(authOptions);
  const _user = session?.user;

  if (!session || !_user) {
    return Response.json({ success: false, message: "Not Authenticated" }, { status: 401 });
  }

  try {
    const { messageId, replyText } = await request.json();

    const result = await UserModel.updateOne(
      {
        _id: new mongoose.Types.ObjectId(_user._id as string),
        "messages._id": new mongoose.Types.ObjectId(messageId as string),
      },
      {
        $set: {
          "messages.$.replyText": replyText,
          "messages.$.repliedAt": new Date(),
        },
      },
      { writeConcern: { w: 1 } }
    );


    if (result.matchedCount === 0) {
      return Response.json({ success: false, message: "Message not found — userId or messageId mismatch" }, { status: 404 });
    }

    if (result.modifiedCount === 0) {
      return Response.json({ success: false, message: "Reply could not be saved" }, { status: 500 });
    }

    return Response.json({ success: true, message: "Reply saved successfully" }, { status: 200 });
  } catch (error) {
    console.error("REPLY_SAVE_ERROR:", error);
    return Response.json({ success: false, message: "Error saving reply" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  await dbConnection();
  const session = await getServerSession(authOptions);
  const _user = session?.user;

  if (!session || !_user) {
    return Response.json({ success: false, message: "Not Authenticated" }, { status: 401 });
  }

  try {
    const { messageId } = await request.json();

    const result = await UserModel.updateOne(
      {
        _id: new mongoose.Types.ObjectId(_user._id as string),
        "messages._id": new mongoose.Types.ObjectId(messageId as string),
      },
      {
        $unset: {
          "messages.$.replyText": "",
          "messages.$.repliedAt": "",
        },
      },
      { writeConcern: { w: 1 } }
    );

    if (result.matchedCount === 0) {
      return Response.json({ success: false, message: "Message not found" }, { status: 404 });
    }

    return Response.json({ success: true, message: "Reply deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("REPLY_DELETE_ERROR:", error);
    return Response.json({ success: false, message: "Error deleting reply" }, { status: 500 });
  }
}






