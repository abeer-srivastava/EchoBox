import { error } from "console"
import mongoose,{Document,Schema} from "mongoose"
import { unique } from "next/dist/build/utils";

export interface Message extends Document{
    content:string,
    createdAt:Date
}

 const messageSchema:Schema<Message>=new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})


// use models as well as the model because in next js the db has not to created every time

export interface User extends Document{
    username:string,
    password:string,
    email:string,
    verifyCode:string,
    verifyCodeExpiry:Date
    isVerified:boolean,
    isAccepting:boolean
    messages:Message[]
}

 const userSchema:Schema<User>=new Schema({
    username:{
        type:String,
        unique:true,
        required:[true,"username is required"]
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    email:{
        type:String,
        unique:[true,"Email is required"],
    },
    verifyCode:{
        type:String,
        required:[true,"Verify code is required"]
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"Verify code expiry is required"]
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAccepting:{
        type:Boolean,
        default:true,
    },
    messages:[messageSchema]
});


const UserModel=(mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User",userSchema))

export default UserModel;