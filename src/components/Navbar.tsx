"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { LogOut, MicVocal, Menu, X, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border py-3">
      <div className="container mx-auto max-w-6xl flex justify-between items-center px-6">
        
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-xl bg-brand-primary/10 transition-colors duration-200"
          >
            <MicVocal className="w-5 h-5 text-brand-primary" />
          </motion.div>
          <span className="text-lg font-bold tracking-tight font-heading">
            
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center text-sm font-medium gap-8">
          <Link href="/features" className="text-muted hover:text-foreground transition-colors duration-200">
            Features
          </Link>
          <Link href="/about" className="text-muted hover:text-foreground transition-colors duration-200">
            About
          </Link>
          <Link href="/contact" className="text-muted hover:text-foreground transition-colors duration-200">
            Contact
          </Link>
        </div>

        {/* Right side (Auth section - Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="outline" className="h-9 px-4 text-sm font-medium border border-border bg-transparent hover:bg-white/5 hover:border-white/15">
                  <LayoutDashboard className="w-4 h-4 mr-1.5" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-2.5 bg-secondary-background/60 border border-border p-1.5 pl-2.5 pr-2.5 rounded-xl">
                <div className="w-6 h-6 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary font-bold text-xs">
                  {user?.name?.[0] || user?.email?.[0] || "U"}
                </div>
                <div className="flex flex-col leading-none text-left">
                  <span className="font-semibold text-xs text-foreground">
                    {user?.name || user?.email?.split('@')[0]}
                  </span>
                </div>
              </div>
              
              <Button
                variant="ghost"
                className="flex items-center gap-1.5 text-muted hover:text-accent-red h-9 rounded-xl text-sm font-medium px-3"
                onClick={() => signOut()}
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/sign-in">
                <Button variant="ghost" className="text-muted hover:text-foreground text-sm font-medium h-9 px-3">
                  Log in
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="text-sm font-medium px-4 h-9 bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl border border-border bg-secondary-background hover:bg-white/5 transition-colors cursor-pointer text-foreground"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Nav Links Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border mt-3 bg-background"
          >
            <div className="flex flex-col gap-4 px-6 py-6 border-b border-border">
              <Link 
                href="/features" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-muted hover:text-foreground transition-colors py-1"
              >
                Features
              </Link>
              <Link 
                href="/about" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-muted hover:text-foreground transition-colors py-1"
              >
                About
              </Link>
              <Link 
                href="/contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-muted hover:text-foreground transition-colors py-1"
              >
                Contact
              </Link>

              <hr className="border-border my-1" />

              {session ? (
                <div className="flex flex-col gap-4 pt-1">
                  <div className="flex items-center gap-2.5 bg-secondary-background/60 border border-border p-2 px-3 rounded-xl w-full">
                    <div className="w-7 h-7 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary font-bold text-xs">
                      {user?.name?.[0] || user?.email?.[0] || "U"}
                    </div>
                    <div className="flex flex-col leading-none text-left">
                      <span className="font-semibold text-sm text-foreground">
                        {user?.name || user?.email?.split('@')[0]}
                      </span>
                      <span className="text-[10px] text-muted mt-0.5">Logged in</span>
                    </div>
                  </div>
                  
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="w-full">
                    <Button variant="outline" className="w-full h-10 text-sm font-medium border border-border bg-transparent hover:bg-white/5">
                      <LayoutDashboard className="w-4 h-4 mr-1.5" />
                      Go to Dashboard
                    </Button>
                  </Link>

                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-center gap-1.5 text-muted hover:text-accent-red h-10 rounded-xl text-sm font-medium border border-dashed border-border"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut();
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pt-1">
                  <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)} className="w-full">
                    <Button variant="ghost" className="w-full text-muted hover:text-foreground text-sm font-medium h-10 border border-border bg-transparent">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)} className="w-full">
                    <Button className="w-full text-sm font-medium h-10 bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
