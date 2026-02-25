"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { LogOut, LogIn, Menu, MicVocal } from "lucide-react";
function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user;

  return (
    <nav className="sticky top-0 z-50 bg-gray-400 border-b-[3px] border-border">
      <div className="container mx-auto flex justify-between items-center px-4 md:px-8 py-4">
        
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 border-[3px] border-border bg-accent-yellow shadow-brutal-sm group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none transition-all">
            <MicVocal  className="w-8 h-8 text-primary" />
          </div>
          <span className="text-3xl text-amber-400 font-bold tracking-tighter text-primary uppercase">
            EchoBox
          </span>
        </Link>

        {/* Desktop Nav Links */}
        {/* <div className="hidden md:flex items-center text-lg font-bold gap-10">
          <Link href="/" className="text-black hover:underline decoration-[3px] underline-offset-4 transition">
            Home
          </Link>
          <Link href="/features" className="text-black hover:underline decoration-[3px] underline-offset-4 transition">
            Features
          </Link>
          <Link href="/about" className="text-black hover:underline decoration-[3px] underline-offset-4 transition">
            About
          </Link>
        </div> */}

        {/* Right side (Auth section) */}
        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-3">
              {/* Avatar Placeholder */}
              <div className="w-10 h-10 border-[3px] border-border bg-accent-green shadow-brutal-sm flex items-center justify-center text-black font-black">
                {user?.name?.[0] || user?.email?.[0] || "U"}
              </div>
              <span className="hidden md:inline font-bold text-black">
                {user?.name || user?.email}
              </span>
              <Button
                size="sm"
                variant="default"
                className="flex items-center gap-2"
                onClick={() => signOut()}
              >
                <LogOut  className="w-4 h-4" /> <span>Logout</span>
              </Button>
            </div>
          ) : (
            <Link href="/sign-in">
              <Button size="sm" className="flex items-center gap-2 bg-accent-yellow text-black border-[3px] border-black shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                <LogIn className="w-4 h-4" /> Login
              </Button>
            </Link>
          )}

          {/* Mobile menu icon */}
          <button className="md:hidden p-2 border-[3px] border-border bg-white shadow-brutal-sm">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
