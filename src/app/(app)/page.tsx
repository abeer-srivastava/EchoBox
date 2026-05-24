'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  ArrowRight, Shield, MicVocal, Copy, 
  MessageSquare, Star, Plus, Minus, Users, 
  Lightbulb, GraduationCap, Heart, Send, Check, Loader2, Lock, Sparkles
} from 'lucide-react';

const testimonials = [
  {
    name: "Alex River",
    role: "Content Creator",
    text: "EchoBox completely changed how I interact with my audience. Honest, direct feedback without any of the toxic comments.",
    avatar: "AR",
  },
  {
    name: "Sarah Chen",
    role: "Engineering Lead",
    text: "We use it for retrospectives and Q&A sessions. The absolute anonymity allows team members to bring up real issues.",
    avatar: "SC",
  },
  {
    name: "Marcus Thorne",
    role: "Product Designer",
    text: "The minimal and flat interface is so clean. It makes collecting and replying to feedback frictionless.",
    avatar: "MT",
  }
];

const faqs = [
  {
    question: "Is EchoBox really anonymous?",
    answer: "Yes, completely. We do not track or log IP addresses, device identifiers, or location data of senders. Messages are sent securely and stored as fully anonymous records."
  },
  {
    question: "How do I share my link?",
    answer: "Once you create your account, you'll receive a unique public link (e.g., echobox.app/u/yourusername) and a custom QR code. You can copy this link into your social media bios or share the QR code offline."
  },
  {
    question: "Can I block offensive senders?",
    answer: "Absolutely. You can toggle your inbox status to closed at any time to halt new submissions. You also have full moderation controls to delete unwanted messages from your board."
  },
  {
    question: "What is Mixed Mode?",
    answer: "Mixed Mode is a privacy setting that lets you choose whether to accept only 100% anonymous messages, or also allow senders to attach their name optionally if they choose to do so."
  },
  {
    question: "Is there any cost or paid tier?",
    answer: "No, EchoBox is 100% free. All features, including AI-driven message ideas, custom QR codes, and unlimited inbox message storage, are fully available without charge."
  }
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Interactive Sandbox (Playground) State
  const [sandboxStep, setSandboxStep] = useState(0); // 0: Input, 1: Loading/Checking, 2: Inbox View, 3: Replied/Public
  const [sandboxMessage, setSandboxMessage] = useState("");
  const [sandboxReply, setSandboxReply] = useState("");
  const [checkingProgress, setCheckingProgress] = useState(0);

  // Bento Grid Sandbox Toggle State
  const [demoInboxOpen, setDemoInboxOpen] = useState(true);

  // Simulated checking steps
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sandboxStep === 1) {
      setCheckingProgress(0);
      interval = setInterval(() => {
        setCheckingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setSandboxStep(2), 500);
            return 100;
          }
          return prev + 25;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [sandboxStep]);

  const handleSendSandboxMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sandboxMessage.trim()) return;
    setSandboxStep(1);
  };

  const handlePublishSandboxReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sandboxReply.trim()) return;
    setSandboxStep(3);
  };

  const resetSandbox = () => {
    setSandboxMessage("");
    setSandboxReply("");
    setSandboxStep(0);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative container mx-auto px-6 py-20 md:py-32 grid md:grid-cols-2 gap-16 items-center max-w-6xl">
        {/* Left Column */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col gap-6"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-brand-primary/10">
              <MicVocal className="w-6 h-6 text-brand-primary" />
            </div>
            <span className="text-lg font-bold tracking-tight font-heading">EchoBox</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight font-heading">
            Anonymous feedback,{' '}
            <span className="text-brand-primary">refined.</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg text-muted max-w-lg leading-relaxed">
            EchoBox provides a secure space for candid feedback, constructive peer reviews, and honest Q&As. Decouple identity from suggestions, safely and for free.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-3 pt-2">
            <Button size="lg" className="group" asChild>
              <Link href="/sign-up">
                Claim Your Username
                <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" onClick={() => {
              const el = document.getElementById('playground');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Try Interactive Demo
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center gap-4 pt-4">
            {["100% Free", "Zero Senders Tracked", "End-to-End Privacy"].map((tag) => (
              <span key={tag} className="text-xs font-semibold text-muted bg-secondary-background px-3 py-1.5 rounded-full border border-border">
                {tag}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Column — Static Showcase */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col gap-4"
        >
          <Card className="bg-secondary-background border border-border shadow-sm">
            <CardHeader className="bg-brand-primary/5 border-b border-border p-5">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                Send Anonymous Note
                <span className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 flex flex-col gap-4">
              <div className="text-sm font-medium text-muted">To: @developer</div>
              <div className="p-4 bg-background border border-border rounded-xl text-sm italic">
                &quot;The new API integration architecture is super clean. Can we document it on the wiki?&quot;
              </div>
              <div className="flex gap-2 justify-end">
                <span className="px-2.5 py-0.5 border border-brand-primary/20 bg-brand-primary/10 text-brand-primary rounded-md text-[10px] font-semibold">
                  Anonymous
                </span>
                <span className="px-2.5 py-0.5 border border-border bg-white/5 text-muted rounded-md text-[10px]">
                  Encrypted
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary-background border border-border shadow-sm ml-6">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-brand-primary/10 rounded-lg flex items-center justify-center text-brand-primary text-xs font-bold">
                  D
                </div>
                <div className="text-xs font-semibold">developer replied:</div>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-sm font-medium italic text-foreground/90">&quot;Yes! I will write a structural blueprint for the wiki tomorrow morning.&quot;</p>
              <div className="text-[10px] text-muted font-medium mt-3">Published 5 minutes ago</div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* 2. PLAYGROUND folds (The Live Sandbox) */}
      <section id="playground" className="py-24 border-t border-border bg-secondary-background/30">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Interactive Message Simulator</h2>
            <p className="text-muted text-base max-w-md mx-auto">See how messages are sent anonymously, checked for safety, and publically replied to.</p>
          </div>

          <div className="max-w-xl mx-auto">
            <AnimatePresence mode="wait">
              {sandboxStep === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border border-border bg-secondary-background">
                    <CardHeader className="border-b border-border p-5">
                      <CardTitle className="text-sm font-semibold">Step 1: Write an Anonymous Message</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <form onSubmit={handleSendSandboxMessage} className="space-y-4">
                        <textarea
                          placeholder="Type something here (e.g. constructive design tips, secret confessions, questions)..."
                          className="w-full p-4 border border-border rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-brand-primary bg-background text-sm min-h-[100px] resize-none"
                          value={sandboxMessage}
                          onChange={(e) => setSandboxMessage(e.target.value)}
                          required
                        />
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted font-medium">Recipient: @your_profile</span>
                          <Button type="submit" disabled={!sandboxMessage.trim()}>
                            <Send className="w-4 h-4 mr-1.5" /> Send Anonymously
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {sandboxStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center p-12 bg-secondary-background border border-border rounded-2xl min-h-[250px]"
                >
                  <Loader2 className="w-10 h-10 animate-spin text-brand-primary mb-4" />
                  <div className="text-sm font-semibold mb-2">Processing Message Routing...</div>
                  <div className="text-xs text-muted text-center max-w-xs">
                    {checkingProgress < 50 ? "Verifying anti-spam parameters..." : "Decrypting headers & checking content safety..."}
                  </div>
                  <div className="w-32 h-1 bg-border rounded-full mt-4 overflow-hidden">
                    <div 
                      className="h-full bg-brand-primary transition-all duration-500" 
                      style={{ width: `${checkingProgress}%` }}
                    />
                  </div>
                </motion.div>
              )}

              {sandboxStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border border-border bg-secondary-background">
                    <CardHeader className="border-b border-border p-5 bg-brand-primary/5 flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-semibold">Step 2: Message Received in Private Inbox</CardTitle>
                      <span className="px-2 py-0.5 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-semibold rounded-md">
                        1 New Message
                      </span>
                    </CardHeader>
                    <CardContent className="p-6 flex flex-col gap-4">
                      <div className="text-sm font-semibold text-foreground bg-background p-4 rounded-xl border border-border">
                        &quot;{sandboxMessage}&quot;
                      </div>
                      
                      <div className="text-xs text-muted mb-2">
                        💡 Since it is anonymous, you don&apos;t know who sent this. You can write a reply to publish it onto your public board.
                      </div>

                      <form onSubmit={handlePublishSandboxReply} className="space-y-4">
                        <textarea
                          placeholder="Type your public reply here..."
                          className="w-full p-4 border border-border rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-brand-primary bg-background text-sm min-h-[80px] resize-none"
                          value={sandboxReply}
                          onChange={(e) => setSandboxReply(e.target.value)}
                          required
                        />
                        <div className="flex justify-between items-center">
                          <Button type="button" variant="outline" onClick={resetSandbox}>
                            Reset Simulator
                          </Button>
                          <Button type="submit" disabled={!sandboxReply.trim()}>
                            <Check className="w-4 h-4 mr-1.5" /> Reply & Publish
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {sandboxStep === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border border-border bg-secondary-background">
                    <CardHeader className="border-b border-border p-5 bg-brand-primary/5 flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-semibold">Step 3: Published to Public Feed</CardTitle>
                      <span className="px-2 py-0.5 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-semibold rounded-md">
                        Published Publicly
                      </span>
                    </CardHeader>
                    <CardContent className="p-6 flex flex-col gap-5">
                      <div className="space-y-4">
                        <div className="text-sm font-medium text-muted">Original Message:</div>
                        <div className="p-4 bg-background border border-border rounded-xl text-sm italic">
                          &quot;{sandboxMessage}&quot;
                        </div>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-6 h-6 bg-brand-primary/10 rounded-lg flex items-center justify-center text-brand-primary text-xs font-bold">
                            Y
                          </div>
                          <div className="text-xs font-semibold">Your reply:</div>
                        </div>
                        <p className="text-sm font-medium italic text-foreground/90 pl-8">&quot;{sandboxReply}&quot;</p>
                      </div>

                      <div className="pt-4 border-t border-border flex justify-between items-center">
                        <span className="text-xs text-muted font-medium">Simulated sequence completed.</span>
                        <Button onClick={resetSandbox}>
                          Reset Simulator
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 3. BENTO GRID FEATURES */}
      <section className="py-24 border-y border-border">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Bento-Grid Feature Matrix</h2>
            <p className="text-muted text-base max-w-md mx-auto">Explore features engineered for absolute privacy and complete custom control.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[220px]">
            
            {/* Box 1: Privacy Engine (Large - 2 cols on desktop) */}
            <Card className="md:col-span-2 md:row-span-1 bg-secondary-background border border-border p-6 flex flex-col justify-between group hover:border-brand-primary/20 transition-all duration-200">
              <div className="flex justify-between items-start">
                <div className="p-2.5 bg-brand-primary/10 rounded-xl">
                  <Lock className="w-5 h-5 text-brand-primary" />
                </div>
                <div className="flex gap-1.5">
                  <span className="px-2.5 py-0.5 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-md text-[10px] font-semibold">
                    Encrypted
                  </span>
                  <span className="px-2.5 py-0.5 bg-white/5 border border-border text-muted rounded-md text-[10px]">
                    HTTPS Only
                  </span>
                </div>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-semibold">Absolute Privacy Engine</h3>
                <p className="text-sm text-muted">We route submissions through a zero-metadata pipeline. No browser footprinting, cookies, or database tracking connects senders to their message payloads.</p>
              </div>
            </Card>

            {/* Box 2: QR Engine */}
            <Card className="bg-secondary-background border border-border p-6 flex flex-col justify-between hover:border-brand-primary/20 transition-all duration-200">
              <div className="p-2.5 bg-accent-yellow/10 rounded-xl w-fit">
                <Copy className="w-5 h-5 text-accent-yellow" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-semibold">Offline Sharing</h3>
                <p className="text-sm text-muted">Generate clean, downloadable vector QR codes to easily receive anonymous feedback from brochures, booklets, or physical events.</p>
              </div>
            </Card>

            {/* Box 3: Inbox Controls (Interactive Switch toggle) */}
            <Card className="bg-secondary-background border border-border p-6 flex flex-col justify-between hover:border-brand-primary/20 transition-all duration-200">
              <div className="flex justify-between items-center">
                <div className="p-2.5 bg-accent-green/10 rounded-xl">
                  <Shield className="w-5 h-5 text-accent-green" />
                </div>
                {/* Micro Toggle switch */}
                <button 
                  onClick={() => setDemoInboxOpen(!demoInboxOpen)}
                  className={`relative w-10 h-6 rounded-full border border-border transition-colors duration-200 outline-none flex items-center px-0.5 cursor-pointer ${demoInboxOpen ? "bg-brand-primary/20" : "bg-background"}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-foreground transition-transform duration-200 ${demoInboxOpen ? "translate-x-4 bg-brand-primary" : "translate-x-0"}`} />
                </button>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-semibold">Inbox Lock: {demoInboxOpen ? "Open" : "Locked"}</h3>
                <p className="text-sm text-muted">Toggle your inbox status dynamically. Instant lockdown prevents any further incoming submissions without deleting your page.</p>
              </div>
            </Card>

            {/* Box 4: AI Suggestions (2 cols on desktop) */}
            <Card className="md:col-span-2 md:row-span-1 bg-secondary-background border border-border p-6 flex flex-col justify-between hover:border-brand-primary/20 transition-all duration-200">
              <div className="flex justify-between items-start">
                <div className="p-2.5 bg-accent-blue/10 rounded-xl">
                  <Sparkles className="w-5 h-5 text-accent-blue" />
                </div>
                <span className="text-[10px] text-muted font-semibold uppercase tracking-wider">AI Copilot</span>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-semibold">Generative Writing Prompts</h3>
                <p className="text-sm text-muted">Stuck on what to ask? Our integrated suggestions engine generates engaging, context-aware prompt questions that senders can click to auto-complete their message instantly.</p>
              </div>
            </Card>

          </div>
        </div>
      </section>

      {/* 4. REFINED USE CASES */}
      <section className="py-24 bg-secondary-background/10">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Engineered for Everyone</h2>
            <p className="text-muted text-base max-w-md mx-auto">EchoBox is custom tailored to adapt to distinct professional and casual workflows.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: "For Creators", desc: "Collect unfiltered suggestions on videos, ideas, and creative directions directly from followers." },
              { icon: Lightbulb, title: "For Teams", desc: "Build safe work retro structures where members can submit honest workplace feedback anonymously." },
              { icon: GraduationCap, title: "For Students", desc: "Collaborate on academic project feedback and peer critiques devoid of any social biases." },
              { icon: Heart, title: "For Friends", desc: "Engage in fun confessions, anonymous Q&A cards, and candid compliments safely with friends." }
            ].map((uc, i) => (
              <Card key={i} className="bg-secondary-background border border-border h-full flex flex-col hover:border-brand-primary/20 transition-all duration-200">
                <CardContent className="p-6 flex flex-col gap-4 flex-grow">
                  <div className="p-2.5 rounded-lg bg-brand-primary/10 w-fit">
                    <uc.icon className="w-5 h-5 text-brand-primary" />
                  </div>
                  <h3 className="font-semibold text-base">{uc.title}</h3>
                  <p className="text-muted text-xs leading-relaxed flex-grow">{uc.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Trusted by Users</h2>
            <div className="flex gap-0.5 justify-center mt-2">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-accent-yellow text-accent-yellow" />)}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Card key={i} className="h-full bg-secondary-background border border-border">
                <CardContent className="p-6 flex flex-col gap-4 h-full justify-between">
                  <MessageSquare className="w-5 h-5 text-muted/30" />
                  <p className="text-sm leading-relaxed italic text-foreground/80 flex-grow">&quot;{t.text}&quot;</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-semibold text-xs">
                      {t.avatar}
                    </div>
                    <div className="flex flex-col leading-none">
                      <span className="font-semibold text-xs">{t.name}</span>
                      <span className="text-[10px] text-muted mt-1">{t.role}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section className="py-24 border-t border-border bg-secondary-background/10">
        <div className="container mx-auto px-6 max-w-2xl">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>

          <div className="flex flex-col gap-2">
            {faqs.map((faq, i) => (
              <div 
                key={i}
                className="rounded-xl border border-border overflow-hidden bg-secondary-background"
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left font-semibold text-sm outline-none transition-colors hover:bg-white/5"
                >
                  {faq.question}
                  <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center shrink-0 ml-4">
                    {openFaq === i ? <Minus className="w-3 h-3 text-muted" /> : <Plus className="w-3 h-3 text-muted" />}
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-4 text-xs text-muted leading-relaxed border-t border-border/50 pt-3">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA BANNER */}
      <section className="container mx-auto px-6 py-24 max-w-5xl">
        <Card className="bg-secondary-background border border-border p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 rounded-2xl">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold font-heading">Ready to hear the truth?</h2>
            <p className="text-muted text-sm max-w-sm">Claim your unique username and start receiving anonymous messages today.</p>
          </div>
          <Button size="lg" className="group shrink-0 px-8" asChild>
            <Link href="/sign-up">
              Get Started <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Button>
        </Card>
      </section>

      {/* 8. FOOTER */}
      <footer className="border-t border-border py-16 bg-background mt-auto">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-12 max-w-5xl">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <MicVocal className="w-5 h-5 text-brand-primary" />
              <span className="text-lg font-bold tracking-tight font-heading">EchoBox</span>
            </div>
            <p className="text-xs text-muted max-w-xs leading-relaxed">A modern, secure framework for anonymous feedback and open, constructive communication.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-20">
            <div className="flex flex-col gap-2.5">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Product</h4>
              <Link href="/features" className="text-xs text-muted hover:text-foreground transition-colors">Features</Link>
              <Link href="#" className="text-xs text-muted hover:text-foreground transition-colors">Safety</Link>
              <Link href="#" className="text-xs text-muted hover:text-foreground transition-colors">Mobile</Link>
            </div>
            <div className="flex flex-col gap-2.5">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Company</h4>
              <Link href="/about" className="text-xs text-muted hover:text-foreground transition-colors">About</Link>
              <Link href="#" className="text-xs text-muted hover:text-foreground transition-colors">Blog</Link>
              <Link href="/contact" className="text-xs text-muted hover:text-foreground transition-colors">Contact</Link>
            </div>
            <div className="flex flex-col gap-2.5">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Support</h4>
              <Link href="#" className="text-xs text-muted hover:text-foreground transition-colors">FAQ</Link>
              <Link href="#" className="text-xs text-muted hover:text-foreground transition-colors">Help Center</Link>
              <Link href="/contact" className="text-xs text-muted hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-6 mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted max-w-5xl">
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
