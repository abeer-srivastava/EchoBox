"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageSquare, Send, Phone, MapPin, Sparkles, Zap, MicVocal } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Message sent!", {
        description: "We'll get back to you as soon as possible.",
      });
      setIsSubmitting(false);
    }, 1500);
  };

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
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden flex flex-col justify-between">
      <section className="container mx-auto px-6 py-20 md:py-32 flex-grow">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid lg:grid-cols-2 gap-16 items-start max-w-5xl mx-auto"
        >
          {/* Left Column: Info */}
          <div className="flex flex-col gap-8">
            <motion.div variants={itemVariants} className="flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-brand-primary/10">
                  <MessageSquare className="w-5 h-5 text-brand-primary" />
                </div>
                <span className="text-sm font-semibold tracking-wider text-brand-primary uppercase">Contact Us</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Let&apos;s Connect</h2>
              <p className="text-base text-muted max-w-md leading-relaxed">
                Have questions, feedback, or just want to say hi? We&apos;d love to hear from you. Our team is always here to help.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: Mail, label: "Email Us", val: "hello@echobox.com", color: "bg-brand-primary/10 text-brand-primary border-brand-primary/20" },
                { icon: Phone, label: "Call Us", val: "+1 (555) 000-0000", color: "bg-accent-blue/10 text-accent-blue border-accent-blue/20" },
                { icon: MapPin, label: "Visit Us", val: "123 Creative St, Digital City", color: "bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20" },
                { icon: Zap, label: "Support", val: "support@echobox.com", color: "bg-accent-pink/10 text-accent-pink border-accent-pink/20" }
              ].map((item, i) => (
                <div key={i} className="p-5 border border-border bg-secondary-background rounded-2xl flex flex-col gap-3 group transition-all duration-200">
                  <div className={`w-10 h-10 ${item.color} border rounded-xl flex items-center justify-center`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[10px] font-semibold text-muted uppercase tracking-wider">{item.label}</span>
                    <span className="text-sm font-semibold text-foreground mt-1.5">{item.val}</span>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="p-6 border border-border bg-secondary-background rounded-2xl">
              <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                Follow the Vibe <Sparkles className="text-accent-yellow w-4 h-4 animate-pulse" />
              </h3>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {["Twitter", "Instagram", "GitHub", "LinkedIn"].map((social) => (
                  <a key={social} href="#" className="text-xs font-semibold text-muted hover:text-brand-primary transition-colors hover:underline">
                    {social}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Form */}
          <motion.div variants={itemVariants}>
            <Card className="border border-border bg-secondary-background shadow-lg overflow-hidden">
              <CardHeader className="bg-brand-primary/5 border-b border-border p-6">
                <CardTitle className="text-lg font-semibold flex items-center justify-between">
                  Send a Message
                  <Send className="w-4 h-4 text-brand-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-foreground">Your Name</label>
                      <Input placeholder="John Doe" className="bg-background" required />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-foreground">Email Address</label>
                      <Input type="email" placeholder="john@example.com" className="bg-background" required />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">Subject</label>
                    <Input placeholder="General Inquiry" className="bg-background" required />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">Message</label>
                    <Textarea 
                      placeholder="Tell us what's on your mind..." 
                      className="min-h-[120px] bg-background border border-border rounded-xl font-medium focus:ring-1 focus:ring-brand-primary p-3" 
                      required 
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="default" 
                    disabled={isSubmitting}
                    className="w-full mt-2"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* FOOTER */}
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
