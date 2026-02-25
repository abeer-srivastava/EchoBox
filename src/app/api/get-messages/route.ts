import dbConnection from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";

import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnection();
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  // Public access for profile pages
  if (username) {
    try {
      const user = await UserModel.findOne({ username });
      if (!user) {
        return Response.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
      }

      // Only return messages that have a reply for public view
      const publicMessages = user.messages
        .filter((msg) => msg.replyText)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      return Response.json(
        { success: true, messages: publicMessages },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error fetching public messages:", error);
      return Response.json(
        { success: false, message: "Error fetching messages" },
        { status: 500 }
      );
    }
  }

  // Private access for dashboard
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user) {
    return Response.json(
      { success: false, message: "User Not Authenticated" },
      { status: 401 }
    );
  }

  try {
    const fullUser = await UserModel.findById(user._id);

    if (!fullUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Sort messages locally for the response
    const sortedMessages = (fullUser.messages || []).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    return Response.json(
      { success: true, messages: sortedMessages },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET_MESSAGES_ERROR:", error);
    return Response.json(
      { success: false, message: "Unexpected error" },
      { status: 500 }
    );
  }
}