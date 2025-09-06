import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnection(): Promise<void> {
  if (connection.isConnected) {
    console.log("⚡ Already connected to MongoDB");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URL || "", {
      dbName: "Echobox", // 👈 important: set your DB name
    });

    connection.isConnected = db.connections[0].readyState;
    console.log("✅ DB connected Successfully");
  } catch (error) {
    console.error("❌ DB Connection Failed", error);
    process.exit(1);
  }
}

export default dbConnection;
