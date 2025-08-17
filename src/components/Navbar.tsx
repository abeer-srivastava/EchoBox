"use client";

import Link from "next/link";
import {useSession ,signOut} from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { BookAIcon, BookOpen, BookOpenText, BookPlus } from "lucide-react";



function Navbar() {
    
    const {data:session}=useSession();
    const user:User=session?.user;  
    
    return (
        <div>
            <nav className="p-4 md:p-6 shadow-md  border-b-2">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <a href="" className="font-bold mb-4 md:mb-0 decoration-0 text-2xl text-gray-950 "><div className="flex flex-row justify-center items-center font-mono "><BookOpenText className="mr-1" /><h1>Mystery Message</h1></div></a>
                {
                    session?(
                    <>
                    <span className="mr-4 ">
                        <span className="mr-4 font-bold font-mono">Welcome,{user.username || user.email}</span>
                        <Button  className="w-full md:w-auto " onClick={()=>signOut()}>
                            LogOut
                        </Button>
                    </span>
                    </>) : (
                    <Link href="/sign-in">
                        <Button className="w-full md:w-auto">Login</Button>
                    </Link>)
                }
                </div>
            </nav>
        </div>
    );
}

export default Navbar;