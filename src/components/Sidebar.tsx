"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { 
  Mail, 
  CheckCircle2, 
  BarChart3, 
  User, 
  HelpCircle, 
  LogOut,
  MicVocal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export default function Sidebar() {
  const pathname = usePathname();
  useSession();

  const navItems = [
    { name: "Inbox", href: "/dashboard", icon: Mail },
    { name: "Published", href: "/dashboard/published", icon: CheckCircle2 },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Account", href: "/dashboard/account", icon: User },
    { name: "Help", href: "/dashboard/help", icon: HelpCircle },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-background border-r-[3px] border-border flex flex-col p-6 z-40">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-12 group">
        <div className="p-2 border-[3px] border-border bg-accent-yellow shadow-brutal-sm group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none transition-all">
          <MicVocal className="w-8 h-8 text-black" />
        </div>
        <span className="text-2xl font-black tracking-tighter uppercase">EchoBox</span>
      </Link>

      {/* Navigation Items */}
      <nav className="flex flex-col gap-4 flex-grow">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 p-3 font-bold transition-all border-[3px] border-transparent",
                isActive 
                  ? "bg-brand-primary text-white border-black shadow-brutal-sm translate-x-[2px] translate-y-[2px]" 
                  : "hover:bg-accent-yellow hover:border-black hover:shadow-brutal-sm"
              )}
            >
              <item.icon className="w-5 h-5 text-lg" />
              <span className="text-lg">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sign Out Button */}
      <div className="mt-auto">
        <Button 
          variant="danger" 
          className="w-full flex items-center justify-center gap-2"
          onClick={() => signOut()}
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </Button>
      </div>
    </aside>
  );
}
