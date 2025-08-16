import mongoose, { mongo } from "mongoose";

type ConnectionObject={
    isConnected?:number
}
const connection:ConnectionObject={};

async function dbConnection():Promise<void>{
    if(connection.isConnected){
        console.log("Already Connected to MONGO");
        return;
    }
    try {
        const db=await mongoose.connect(process.env.MONGO_URI||"")
        // console.log(db);
        // console.log(db.connections);
        connection.isConnected=db.connections[0].readyState;
        console.log("DB connected Successfully");
    } catch (error) {
        console.log("DB Connection Failed",error);
        process.exit(1);
    }
}
export default dbConnection;