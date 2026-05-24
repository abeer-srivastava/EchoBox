"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Lock, Zap, Globe, ShieldCheck, Sparkles, MicVocal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function About() {
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
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden flex flex-col">
      {/* HERO SECTION */}
      <section className="container mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-3xl flex flex-col items-center gap-6"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-brand-primary/10">
              <MicVocal className="w-6 h-6 text-brand-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight font-heading">EchoBox</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight font-heading">
            Our Mission is <span className="text-brand-primary font-bold">Authenticity</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg text-muted max-w-2xl leading-relaxed">
            EchoBox is a secure and simple way to connect with friends, share thoughts, and collect honest feedback — all while keeping your identity safe.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3 pt-2">
            <Button size="lg" asChild>
              <Link href="/sign-up">Join the Movement</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* CORE VALUES GRID */}
      <section className="bg-secondary-background border-y border-border py-24">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center mb-16 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Why we exist</h2>
            <p className="text-muted text-lg max-w-md">Our core pillars of open and safe communication</p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {[
              { 
                icon: <Users className="w-6 h-6 text-brand-primary" />, 
                title: "Built for Connection", 
                desc: "Engage with friends, classmates, or colleagues in conversations that matter without filters.",
              },
              { 
                icon: <Lock className="w-6 h-6 text-brand-primary" />, 
                title: "Privacy First", 
                desc: "With end-to-end safety and anonymous interactions, your identity remains secure at all times.",
              },
              { 
                icon: <Zap className="w-6 h-6 text-brand-primary" />, 
                title: "Fast & Clean", 
                desc: "Real-time updates, smooth transitions, and a clean interface that keeps the experience fresh.",
              },
              { 
                icon: <ShieldCheck className="w-6 h-6 text-brand-primary" />, 
                title: "Secure & Trusted", 
                desc: "We prioritize safety with moderation rules and anti-abuse measures to protect our users.",
              },
              { 
                icon: <Globe className="w-6 h-6 text-brand-primary" />, 
                title: "Accessible Anywhere", 
                desc: "Use EchoBox across any device seamlessly — no app downloads required.",
              },
              { 
                icon: <Sparkles className="w-6 h-6 text-brand-primary" />, 
                title: "Fun Interactions", 
                desc: "Generate creative AI suggestions, share QR codes, and customize replies.",
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="hover:border-brand-primary/20 transition-all duration-300 h-full">
                  <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                    <div className="p-3 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STORY SECTION */}
      <section className="container mx-auto px-6 py-24 flex-grow flex items-center">
        <div className="grid md:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Genuine <span className="text-brand-primary">Conversations</span>
            </h2>
            <p className="text-base text-muted leading-relaxed">
              Whether you want to strengthen friendships, exchange ideas freely, or just have fun with anonymous messages, EchoBox is here to create a safe digital space. Our mission is to keep online conversations genuine, respectful, and meaningful.
            </p>
            <div className="p-5 rounded-xl bg-brand-primary/5 border border-brand-primary/10">
              <p className="text-sm italic text-foreground/80">&quot;Honesty is the fastest way to build trust, even when it&apos;s anonymous.&quot;</p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Card className="aspect-video flex items-center justify-center p-8 bg-secondary-background border border-border">
              <div className="w-full h-full bg-background border border-border rounded-xl p-5 flex flex-col justify-center gap-4">
                <div className="h-4 w-3/4 bg-white/5 rounded-md" />
                <div className="h-4 w-full bg-white/5 rounded-md" />
                <div className="h-4 w-2/3 bg-white/5 rounded-md" />
                <div className="mt-4 flex justify-end">
                  <div className="h-8 w-24 bg-brand-primary rounded-lg" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
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
