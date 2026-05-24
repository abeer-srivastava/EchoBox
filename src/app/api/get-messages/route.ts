import dbConnection from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnection();
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;

  // Public access for profile pages
  if (username) {
    try {
      const result = await UserModel.aggregate([
        { $match: { username } },
        {
          $project: {
            privacyType: 1,
            filteredMessages: {
              $filter: {
                input: { $ifNull: ["$messages", []] },
                as: "msg",
                cond: { $ne: [{ $ifNull: ["$$msg.replyText", ""] }, ""] }
              }
            }
          }
        },
        {
          $project: {
            privacyType: 1,
            totalMessages: { $size: "$filteredMessages" },
            paginatedMessages: {
              $slice: [
                {
                  $sortArray: {
                    input: "$filteredMessages",
                    sortBy: { createdAt: -1 }
                  }
                },
                skip,
                limit
              ]
            }
          }
        }
      ]);

      if (!result || result.length === 0) {
        return Response.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
      }

      const { privacyType, totalMessages, paginatedMessages } = result[0];

      return Response.json(
        { 
          success: true, 
          messages: paginatedMessages || [],
          privacyType: privacyType || 'anonymous-only',
          pagination: {
            currentPage: page,
            limit,
            totalMessages: totalMessages || 0,
            totalPages: Math.ceil((totalMessages || 0) / limit)
          }
        },
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
    const userId = new mongoose.Types.ObjectId(user._id as string);
    const result = await UserModel.aggregate([
      { $match: { _id: userId } },
      {
        $project: {
          totalMessages: { $size: { $ifNull: ["$messages", []] } },
          paginatedMessages: {
            $slice: [
              {
                $sortArray: {
                  input: { $ifNull: ["$messages", []] },
                  sortBy: { createdAt: -1 }
                }
              },
              skip,
              limit
            ]
          }
        }
      }
    ]);

    if (!result || result.length === 0) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const { totalMessages, paginatedMessages } = result[0];

    return Response.json(
      {
        success: true,
        messages: paginatedMessages || [],
        pagination: {
          currentPage: page,
          limit,
          totalMessages: totalMessages || 0,
          totalPages: Math.ceil((totalMessages || 0) / limit)
        }
      },
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