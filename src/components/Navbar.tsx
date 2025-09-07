"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { BookOpenText, LogOut, LogIn, Menu, MicVocal } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle"
function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user;

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-b from-emerald-50 via-white to-lime-50 backdrop-blur-md border-b shadow-sm">
      <div className="container mx-auto flex justify-between items-center px-4 md:px-8 py-4">
        
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-2">
          <MicVocal  className="w-10 h-10 text-emerald-500" />
          <span className="text-3xl font-extrabold tracking-tight font-mono text-emerald-500 bg-clip-text ">
            EchoBox
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center text-lg  gap-30">
          <Link href="/" className="text-gray-700 hover:text-emerald-500 transition">
            Home
          </Link>
          <Link href="/features" className="text-gray-700 hover:text-emerald-500 transition">
            Features
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-emerald-500 transition">
            About
          </Link>
        </div>

        {/* Right side (Auth section) */}
        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-3">
              {/* Avatar Placeholder */}
              <div className="w-8 h-8 rounded-full  bg-emerald-500  flex items-center justify-center text-white font-bold">
                {user?.name?.[0] || user?.email?.[0] || "U"}
              </div>
              <span className="hidden md:inline font-mono font-medium text-gray-800">
                {user?.name || user?.email}
              </span>
              <Button
                size="sm"
                variant="default"
                className="flex items-center gap-2"
                onClick={() => signOut()}
                
              >
                <LogOut  className="w-4 h-4" /><Link href="/"> Logout</Link>
              </Button>
            </div>
          ) : (
            <Link href="/sign-in">
              <Button size="sm" className="flex items-center gap-2">
                <LogIn className="w-4 h-4" /> Login
              </Button>
            </Link>
          )}

          {/* Mobile menu icon */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
