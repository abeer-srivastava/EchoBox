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
import { motion } from "framer-motion";

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const containerVariants: any = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const itemVariants: any = {
    hidden: { opacity: 0, x: -8 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-background border-r border-border flex flex-col p-5 z-40">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 mb-10 group">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="p-2 rounded-xl bg-brand-primary/10 group-hover:bg-brand-primary/20 transition-colors duration-200"
        >
          <MicVocal className="w-6 h-6 text-brand-primary" />
        </motion.div>
        <span className="text-lg font-bold tracking-tight font-heading">EchoBox</span>
      </Link>

      {/* Navigation Items */}
      <motion.nav 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-1 flex-grow"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <motion.div key={item.name} variants={itemVariants}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-brand-primary/10 text-brand-primary" 
                    : "text-muted hover:text-foreground hover:bg-white/5"
                )}
              >
                <item.icon className={cn("w-[18px] h-[18px]", isActive ? "text-brand-primary" : "")} />
                <span>{item.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </motion.nav>

      {/* Sign Out Button */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-auto pt-4 border-t border-border"
      >
        <Button 
          variant="ghost" 
          className="w-full flex items-center justify-start gap-2.5 h-10 text-muted hover:text-accent-red font-medium text-sm"
          onClick={() => signOut()}
        >
          <LogOut className="w-[18px] h-[18px]" />
          <span>Sign Out</span>
        </Button>
      </motion.div>
    </aside>
  );
}
