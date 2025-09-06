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
async authorize(credentials: Record<string, string> | undefined): Promise<any> {
  await dbConnection();
  if (!credentials) return null;

  try {
    // NextAuth sends it as "identifier" by default
      const identifier = credentials.email || credentials.identifier;
      const password = credentials.password;

      console.log("Identifier:", identifier);

      const user = await UserModel.findOne({
        $or: [{ email: identifier }, { username: identifier }],
      });

      console.log("Found user:", user);

      if (!user) {
        throw new Error("No User Found With this Username or Email");
      }

      if (!user.isVerified) {
        throw new Error("Please verify your account before logging in");
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        throw new Error("Incorrect Password");
      }

      return user;
    } catch (error) {
      console.error("Authorize error:", error);
      throw new Error("Error in Authoptions");
    }
  }
,
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