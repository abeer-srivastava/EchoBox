import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseGlobal: MongooseCache | undefined;
}

const cached: MongooseCache = globalThis.mongooseGlobal || { conn: null, promise: null };

if (!globalThis.mongooseGlobal) {
  globalThis.mongooseGlobal = cached;
}

async function dbConnection(): Promise<void> {
  if (cached.conn) {
    console.log("Already connected to MongoDB (cached)");
    return;
  }

  if (!cached.promise) {
    const opts = {
      dbName: "Echobox",
      maxPoolSize: 10,
      minPoolSize: 0,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      maxIdleTimeMS: 30000,
      writeConcern: { w: 1 },
      bufferCommands: false,
    };

    console.log("Connecting to MongoDB...");
    cached.promise = mongoose.connect(process.env.MONGO_URL || "", opts).then((mongooseInstance) => {
      console.log("MongoDB connected successfully");
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("MongoDB Connection Failed:", e);
    throw e;
  }
}

export default dbConnection;
