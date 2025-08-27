import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnection from '@/lib/dbConnect';
import UserModel from '@/model/User';


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
async authorize(credentials: Record<"email" | "password", string> | undefined): Promise<any> {
        await dbConnection();
        if(!credentials) return null;
        try {
          const {email}=credentials;

            const user= await UserModel.findOne({
                $or:[
                    {email},
                    {username:email}
                ],
            });
            if(!user){
                throw new Error("No User Found With this UserName OR Email")
            }
            if(user && !user?.isVerified){
                throw new Error('Please verify your account before logging in');
            }
            const isPasswordCorrect=await bcrypt.compare(credentials.password,user.password);
            if(isPasswordCorrect){
                return user;
            }
            else{
                throw new Error("Incorrect Password");
            }
        } catch (error) {
          console.log(error);
            throw new Error("Error in Authoptions")
        }
      },
    }),
  ],
  callbacks:{
    async jwt({token,user}){
        if(user){
        token._id=user._id?.toString()
        token.isVerified=user.isVerified
        token.isAcceptingMessages=user.isAcceptingMessages
        token.username=user.username
        }
        return  token;
    },
    async session({session,token}){
        if(token){
            session.user._id=token._id
            session.user.isVerified=token.isVerified
            session.user.isAcceptingMessages=token.isAcceptingMessages
            session.user.username=token.username    
        }
        return session;
    }
  },
  pages:{
    signIn:"/auth/sign-in"
  },
  session:{
    strategy:"jwt"
  },
  secret:process.env.NEXTAUTH_SECRET,

};