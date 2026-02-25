'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, ArrowRight, Shield, UserCheck, Zap, MicVocal, Copy, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-accent-yellow font-sans">
      
      {/* SECTION 1: HERO */}
      <section className="container mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Column */}
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <div className="p-3 border-[3px] border-border bg-accent-yellow shadow-brutal-sm">
              <MicVocal className="w-8 h-8 text-black" />
            </div>
            <span className="text-3xl font-black tracking-tighter uppercase font-heading">EchoBox</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight uppercase font-heading">
            Dive into the World of <span className="bg-brand-primary text-white px-2 py-1 border-[3px] border-black shadow-brutal-md">Anonymous</span> Feedback
          </h1>

          <p className="text-xl md:text-2xl font-bold text-black/80 max-w-xl font-sans">
            EchoBox – Where your identity remains a secret. Get honest feedback, connect with friends, and share your thoughts freely.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-brand-primary text-white group" asChild>
              <Link href="/sign-up">
                Continue with Google <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Right Column */}
        <div className="relative">
          <Card className="bg-white border-[3px] border-border shadow-brutal-lg">
            <CardHeader className="bg-accent-pink border-b-[3px] border-border p-6">
              <CardTitle className="text-2xl font-black uppercase flex items-center justify-between">
                Send me a message
                <div className="px-3 py-1 bg-white border-[3px] border-black text-xs font-black shadow-brutal-sm">LIVE</div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2 p-4 border-[3px] border-border bg-secondary-background font-bold text-black/60">
                echobox.com/u/anonymous
                <Copy className="ml-auto w-5 h-5 cursor-pointer hover:scale-110 transition-transform" />
              </div>

              <div className="flex flex-col gap-3 mt-4">
                <div className="p-4 border-[3px] border-border bg-white shadow-brutal-sm self-start max-w-[80%] font-bold">
                  Hey! I really like your work. Keep it up! 🚀
                </div>
                <div className="p-4 border-[3px] border-border bg-accent-yellow shadow-brutal-sm self-end max-w-[80%] font-bold">
                  Thank you! That means a lot. 🙏
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <div className="px-3 py-1 bg-accent-green border-[3px] border-border text-xs font-black uppercase flex items-center gap-1 shadow-brutal-sm">
                  <CheckCircle2 className="w-3 h-3" /> Anonymous
                </div>
                <div className="px-3 py-1 bg-white border-[3px] border-border text-xs font-black uppercase shadow-brutal-sm">
                  Secret
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="absolute -bottom-6 -right-6 p-4 bg-accent-yellow border-[3px] border-border font-black shadow-brutal-md rotate-3 hidden md:block">
            STAY ANONYMOUS!
          </div>
        </div>
      </section>

      {/* SECTION 2: FEATURE GRID */}
      <section className="bg-secondary-background border-y-[3px] border-border py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-16 uppercase text-center underline decoration-accent-pink decoration-[6px] underline-offset-8">
            How it works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Row 1 */}
            <Card className="hover:bg-accent-yellow group transition-colors">
              <CardContent className="p-8 flex flex-col gap-4">
                <Mail className="w-12 h-12 text-black" />
                <span className="text-xs font-black uppercase text-black/60">01. INBOX</span>
                <h3 className="text-2xl font-black uppercase">Private Inbox</h3>
                <p className="font-bold">Receive messages from anyone without knowing their identity.</p>
              </CardContent>
            </Card>

            <Card className="hover:bg-accent-pink group transition-colors">
              <CardContent className="p-8 flex flex-col gap-4">
                <ArrowRight className="w-12 h-12 text-black" />
                <span className="text-xs font-black uppercase text-black/60">02. REPLIES</span>
                <h3 className="text-2xl font-black uppercase">Quick Replies</h3>
                <p className="font-bold">Respond to feedback instantly while staying anonymous.</p>
              </CardContent>
            </Card>

            <Card className="hover:bg-accent-green group transition-colors">
              <CardContent className="p-8 flex flex-col gap-4">
                <Copy className="w-12 h-12 text-black" />
                <span className="text-xs font-black uppercase text-black/60">03. SHARE</span>
                <h3 className="text-2xl font-black uppercase">Easy Sharing</h3>
                <p className="font-bold">Share your unique link on social media with one click.</p>
              </CardContent>
            </Card>

            {/* Row 2 */}
            <Card className="hover:bg-brand-primary hover:text-white group transition-colors">
              <CardContent className="p-8 flex flex-col gap-4">
                <Zap className="w-12 h-12 text-black group-hover:text-white" />
                <span className="text-xs font-black uppercase text-black/60 group-hover:text-white/80">04. QR</span>
                <h3 className="text-2xl font-black uppercase">QR Codes</h3>
                <p className="font-bold">Generate QR codes for your profile to share offline.</p>
              </CardContent>
            </Card>

            <Card className="hover:bg-accent-red hover:text-white group transition-colors">
              <CardContent className="p-8 flex flex-col gap-4">
                <Shield className="w-12 h-12 text-black group-hover:text-white" />
                <span className="text-xs font-black uppercase text-black/60 group-hover:text-white/80">05. SAFETY</span>
                <h3 className="text-2xl font-black uppercase">Safety First</h3>
                <p className="font-bold">Built-in moderation to keep the conversation respectful.</p>
              </CardContent>
            </Card>

            <Card className="hover:bg-accent-yellow group transition-colors">
              <CardContent className="p-8 flex flex-col gap-4">
                <UserCheck className="w-12 h-12 text-black" />
                <span className="text-xs font-black uppercase text-black/60">06. CONTROLS</span>
                <h3 className="text-2xl font-black uppercase">Full Controls</h3>
                <p className="font-bold">Manage your profile and visibility settings with ease.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 3: VISIBILITY ENGINE BLOCK */}
      <section className="container mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center bg-background">
        <div className="flex flex-col gap-6">
          <h2 className="text-4xl md:text-5xl font-black uppercase leading-none font-heading">
            Visibility <br /> <span className="text-accent-pink underline decoration-[6px]">Engine</span>
          </h2>
          <p className="text-xl font-bold font-sans">
            Control exactly how your messages are seen. Decide which replies go public and which stay private in your inbox.
          </p>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="p-6 border-[3px] border-border bg-white shadow-brutal-sm font-black uppercase font-heading">
            Anonymous message arrives
          </div>
          <ArrowRight className="w-8 h-8 mx-auto rotate-90" />
          <div className="p-6 border-[3px] border-border bg-accent-green shadow-brutal-sm font-black uppercase font-heading">
            Replied messages published
          </div>
          <div className="p-6 border-[3px] border-border bg-accent-red text-white shadow-brutal-sm font-black uppercase font-heading">
            Unreplied stays private
          </div>
          <div className="p-6 border-[3px] border-border bg-brand-primary text-white shadow-brutal-sm font-black uppercase font-heading">
            Public feed shows replied messages
          </div>
        </div>
      </section>

      {/* SECTION 4: CONTROLS ROW */}
      <section className="bg-accent-yellow border-y-[3px] border-border py-12">
        <div className="container mx-auto px-6 flex flex-wrap justify-center gap-8">
          <div className="flex items-center gap-3 font-black uppercase text-xl border-[3px] border-black p-4 bg-white shadow-brutal-sm font-heading">
            Inbox Controls <CheckCircle2 />
          </div>
          <div className="flex items-center gap-3 font-black uppercase text-xl border-[3px] border-black p-4 bg-white shadow-brutal-sm font-heading">
            Privacy Focus <Shield />
          </div>
          <div className="flex items-center gap-3 font-black uppercase text-xl border-[3px] border-black p-4 bg-white shadow-brutal-sm font-heading">
            Safety First <Zap />
          </div>
        </div>
      </section>

      {/* SECTION 5: SAFETY & MOBILE */}
      <section className="container mx-auto px-6 py-24 grid md:grid-cols-2 gap-8 bg-background">
        <Card className="bg-accent-red text-white p-12 flex flex-col gap-6">
          <Shield className="w-16 h-16" />
          <h3 className="text-4xl font-black uppercase font-heading">Safety & Moderation</h3>
          <p className="text-xl font-bold font-sans">Advanced AI filters to ensure a positive environment for everyone.</p>
        </Card>
        <Card className="bg-brand-primary text-white p-12 flex flex-col gap-6">
          <Zap className="w-16 h-16" />
          <h3 className="text-4xl font-black uppercase font-heading">Mobile Ready</h3>
          <p className="text-xl font-bold font-sans">Access EchoBox on any device with a smooth, responsive interface.</p>
        </Card>
      </section>

      {/* SECTION 6: CTA BANNER */}
      <section className="container mx-auto px-6 pb-24 bg-background">
        <Card className="bg-accent-yellow border-[3px] border-border p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl font-black uppercase font-heading">Ready to dive in?</h2>
            <p className="text-xl font-bold font-sans">Claim your unique username and start receiving messages.</p>
          </div>
          <Button size="lg" className="bg-black text-white px-12 h-16 text-2xl font-black uppercase shadow-brutal-md font-heading">
            Claim Username
          </Button>
        </Card>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-white py-12 border-t-[3px] border-white">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <MicVocal className="w-8 h-8 text-accent-yellow" />
            <span className="text-2xl font-black uppercase">EchoBox</span>
          </div>
          <p className="font-bold text-white/60">© 2026 Echobox. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="font-black uppercase hover:text-accent-yellow">Twitter</Link>
            <Link href="#" className="font-black uppercase hover:text-accent-yellow">GitHub</Link>
            <Link href="#" className="font-black uppercase hover:text-accent-yellow">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
