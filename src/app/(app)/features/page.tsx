"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  EyeOff,
  Sparkles,
  Share2,
  MessageCircle,
  Zap,
  MicVocal,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Anonymous Messaging",
    description:
      "Send and receive messages without revealing your identity. Perfect for honest feedback and fun secrets.",
    icon: EyeOff,
  },
  {
    title: "Privacy First",
    description:
      "Your data stays safe with end-to-end encryption and no unnecessary tracking.",
    icon: Shield,
  },
  {
    title: "Clean Design",
    description:
      "A modern, minimal UI focused on readability and simplicity, making interactions delightful.",
    icon: Sparkles,
  },
  {
    title: "Easy Sharing",
    description:
      "Generate sharable links to invite friends and collect feedback effortlessly.",
    icon: Share2,
  },
  {
    title: "Real-time Inbox",
    description:
      "Get instant updates as soon as someone sends you a new message.",
    icon: MessageCircle,
  },
  {
    title: "Lightning Fast",
    description:
      "Optimized for speed so your messages load instantly, anywhere, anytime.",
    icon: Zap,
  },
];

export default function Features() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const itemVariants: any = {
    hidden: { y: 12, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <div className="text-foreground flex flex-col min-h-screen bg-background font-sans overflow-x-hidden">
      {/* Features Section */}
      <section className="container mx-auto px-6 py-20 md:py-32 flex-1">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-3xl mx-auto text-center mb-20"
        >
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-2.5 mb-6">
            <div className="p-2.5 rounded-xl bg-brand-primary/10">
              <MicVocal className="w-6 h-6 text-brand-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight font-heading">EchoBox</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight font-heading mb-6">
            Packed with <span className="text-brand-primary">Power</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg text-muted max-w-xl mx-auto leading-relaxed">
            Everything you need to make mystery messaging fun, safe, and engaging. No compromises.
          </motion.p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {features.map((feature, idx) => (
            <motion.div
              key={`${idx}-${feature.title}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:border-brand-primary/20 transition-all duration-300 group">
                <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                  <div className="p-3.5 rounded-xl bg-brand-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    <feature.icon className="w-6 h-6 text-brand-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 text-center max-w-3xl mx-auto"
        >
          <Card className="p-10 md:p-14 bg-secondary-background border border-border rounded-2xl flex flex-col items-center gap-6">
             <h2 className="text-2xl md:text-3xl font-bold">Ready to start?</h2>
             <Button size="lg" className="group" asChild>
                <Link href="/sign-up">
                  Claim Your Username 
                  <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
             </Button>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-16 bg-background">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <MicVocal className="w-5 h-5 text-brand-primary" />
              <span className="text-lg font-bold tracking-tight font-heading">EchoBox</span>
            </div>
            <p className="text-sm text-muted max-w-xs">The platform for anonymous feedback and honest connections.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-20">
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold text-foreground">Product</h4>
              <Link href="/features" className="text-sm text-muted hover:text-foreground transition-colors">Features</Link>
              <Link href="#" className="text-sm text-muted hover:text-foreground transition-colors">Safety</Link>
              <Link href="#" className="text-sm text-muted hover:text-foreground transition-colors">Mobile</Link>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold text-foreground">Company</h4>
              <Link href="/about" className="text-sm text-muted hover:text-foreground transition-colors">About</Link>
              <Link href="#" className="text-sm text-muted hover:text-foreground transition-colors">Blog</Link>
              <Link href="/contact" className="text-sm text-muted hover:text-foreground transition-colors">Contact</Link>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold text-foreground">Support</h4>
              <Link href="#" className="text-sm text-muted hover:text-foreground transition-colors">FAQ</Link>
              <Link href="#" className="text-sm text-muted hover:text-foreground transition-colors">Help Center</Link>
              <Link href="/contact" className="text-sm text-muted hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-6 mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted">
          <p>© 2026 EchoBox. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Instagram</Link>
            <Link href="#" className="hover:text-foreground transition-colors">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
