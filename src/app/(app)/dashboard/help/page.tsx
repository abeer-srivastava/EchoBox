"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  HelpCircle, 
  UserPlus, 
  Lock, 
  ShieldCheck, 
  Eye,
  ArrowRight,
  MessageCircle,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HelpPage() {
  const sections = [
    {
      title: "Getting Started",
      icon: <UserPlus className="w-5 h-5 text-brand-primary" />,
      content: [
        {
          label: "1. Claim your username",
          text: "Go to your Account settings to set a unique username that represents you."
        },
        {
          label: "2. Share your link",
          text: "Your unique link is the key. Post it on your Instagram bio, Twitter, or anywhere people can reach you."
        },
        {
          label: "3. Receive messages",
          text: "Anyone with your link can send messages. Senders don't need an account, ensuring total anonymity."
        }
      ]
    },
    {
      title: "Replies & Visibility",
      icon: <Eye className="w-5 h-5 text-brand-primary" />,
      content: [
        {
          label: "Private by default",
          text: "All incoming messages are for your eyes only. They stay in your private inbox until you act on them."
        },
        {
          label: "Public showcase",
          text: "When you reply to a message, it gets published to your profile. You control your public feed by choosing what to answer."
        },
        {
          label: "Stay secret",
          text: "Messages you don't reply to never go public. They remain safely tucked away in your private dashboard."
        }
      ]
    },
    {
      title: "Anonymous Senders",
      icon: <Lock className="w-5 h-5 text-brand-primary" />,
      bodyText: `EchoBox is designed for radical honesty. By allowing unauthenticated users to message you, we remove all friction from the conversation.

We use advanced AI-powered filters to catch abuse before it hits your inbox, ensuring your experience stays positive.`
    },
    {
      title: "Inbox Controls",
      icon: <ShieldCheck className="w-5 h-5 text-brand-primary" />,
      content: [
        {
          label: "Smart Filters",
          text: "Block specific words or phrases to automatically filter out unwanted content from your inbox."
        },
        {
          label: "Pause Mode",
          text: "Need some quiet time? Use the Pause feature to temporarily stop receiving new messages without closing your account."
        },
        {
          label: "Mixed Privacy",
          text: "Choose between 'Anonymous Only' or 'Allow Named' to control if senders can optionally reveal their identity."
        }
      ]
    }
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const itemVariants: any = {
    hidden: { y: 12, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col gap-8 max-w-5xl mx-auto p-4 pb-32"
    >
      {/* Header */}
      <motion.header variants={itemVariants} className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-primary/10 rounded-xl">
            <HelpCircle className="w-6 h-6 text-brand-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-heading">Help Center</h1>
        </div>
        <p className="text-base text-muted max-w-xl">Master the art of anonymous connection. Everything you need to know about using EchoBox.</p>
      </motion.header>

      <motion.div variants={itemVariants}>
        <Separator className="bg-border" />
      </motion.div>

      {/* Grid of help sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className="h-full"
          >
            <Card className="bg-secondary-background border border-border rounded-2xl shadow-sm h-full flex flex-col transition-all duration-200">
              <CardHeader className="p-6 border-b border-border flex flex-row items-center gap-3 bg-brand-primary/5">
                <div className="p-2 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                  {section.icon}
                </div>
                <CardTitle className="text-lg font-bold font-heading">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex-grow flex flex-col gap-6">
                 {section.content ? (
                   <div className="flex flex-col gap-5">
                     {section.content.map((item, i) => (
                       <div key={i} className="flex items-start gap-3">
                         <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                         <div className="flex flex-col gap-1">
                           <span className="text-sm font-semibold text-foreground">{item.label}</span>
                           <p className="text-xs text-muted leading-relaxed">{item.text}</p>
                         </div>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <p className="text-sm text-muted leading-relaxed whitespace-pre-wrap">{section.bodyText}</p>
                 )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Footer CTA */}
      <motion.div variants={itemVariants} className="mt-8">
        <Card className="bg-secondary-background border border-border rounded-2xl overflow-hidden relative">
           <CardContent className="p-8 md:p-10 text-center flex flex-col items-center gap-6">
              <div className="p-3.5 bg-brand-primary/10 rounded-2xl text-brand-primary w-fit">
                <MessageCircle className="w-8 h-8" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-xl md:text-2xl font-bold font-heading">Still Stuck?</h3>
                <p className="text-sm text-muted max-w-sm">Our support team is ready to help you out. Drop us a line anytime.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                <Button size="lg" asChild>
                  <Link href="/contact" className="flex items-center gap-1.5 text-sm font-semibold">
                    Contact Support <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact" className="flex items-center gap-1.5 text-sm font-semibold">
                    Join Discord <Sparkles className="w-4 h-4 text-accent-pink" />
                  </Link>
                </Button>
              </div>
           </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
