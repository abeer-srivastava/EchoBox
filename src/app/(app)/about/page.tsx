"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Lock, Zap, Globe, ShieldCheck, Sparkles, Github, Mail } from "lucide-react";

export default function About() {
  return (
    <section className="text-black py-20 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-emerald-50 via-white to-lime-50 dark:bg-neutral-900">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold tracking-tight mb-6"
        >
          👋 About Mystery Message
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12"
        >
          Mystery Message is a fun and secure way to connect with friends, share
          secrets, and give honest feedback — all while keeping your identity
          safe. With a focus on{" "}
          <span className="font-semibold">privacy</span>,{" "}
          <span className="font-semibold">simplicity</span>, and{" "}
          <span className="font-semibold">engagement</span>, it’s designed to
          make conversations more exciting and authentic.  
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-base text-muted-foreground max-w-2xl mx-auto mb-16"
        >
          Whether you want to strengthen friendships, exchange ideas freely, or
          just have fun with anonymous messages, Mystery Message is here to
          create a safe digital space. Our mission is to keep online
          conversations genuine, respectful, and meaningful.
        </motion.p>
      </div>

      {/* First row of features */}
      <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto mb-12">
        <FeatureCard
          icon={<Users className="w-10 h-10 mb-4 mx-auto text-black dark:text-white" />}
          title="Built for Connection"
          description="Whether it’s friends, classmates, or colleagues — engage in conversations that matter."
          delay={0.3}
        />
        <FeatureCard
          icon={<Lock className="w-10 h-10 mb-4 mx-auto text-black dark:text-white" />}
          title="Privacy First"
          description="With end-to-end safety and anonymous interactions, your identity remains secure at all times."
          delay={0.4}
        />
        <FeatureCard
          icon={<Zap className="w-10 h-10 mb-4 mx-auto text-black dark:text-white" />}
          title="Fast & Engaging"
          description="Real-time updates and a playful design keep the experience fresh and exciting every time."
          delay={0.5}
        />
      </div>

      {/* Second row of features */}
      <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
        <FeatureCard
          icon={<ShieldCheck className="w-10 h-10 mb-4 mx-auto text-black dark:text-white" />}
          title="Secure & Trusted"
          description="We prioritize safety with strong encryption and anti-abuse measures to protect users."
          delay={0.6}
        />
        <FeatureCard
          icon={<Globe className="w-10 h-10 mb-4 mx-auto text-black dark:text-white" />}
          title="Accessible Anywhere"
          description="Use Mystery Message across devices seamlessly — no matter where you are."
          delay={0.7}
        />
        <FeatureCard
          icon={<Sparkles className="w-10 h-10 mb-4 mx-auto text-black dark:text-white" />}
          title="Fun & Customizable"
          description="Personalize your experience with themes, reactions, and playful interactions."
          delay={0.8}
        />
      </div>
       <footer className="border-t-4 border-black py-10 mt-16 bg-white dark:bg-neutral-900 shadow-[4px_4px_0px_0px_#000]">
        <div className="max-w-6xl mx-auto px-6 md:px-12 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-muted-foreground mb-4"
          >
            Made with ❤️ by the abeer_srivastava
          </motion.p>

          <div className="flex justify-center gap-6">
            <a
              href="mailto:contact@mysterymessage.app"
              className="flex items-center gap-2 font-medium hover:underline"
            >
              <Mail className="w-5 h-5" /> Contact
            </a>
            <a
              href="https://github.com/your-repo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-medium hover:underline"
            >
              <Github className="w-5 h-5" /> GitHub
            </a>
            <a
              href="https://mysterymessage.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-medium hover:underline"
            >
              <Globe className="w-5 h-5" /> Website
            </a>
          </div>
        </div>
      </footer>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="border-4 border-black shadow-[4px_4px_0px_0px_#000] bg-white dark:bg-neutral-900 hover:shadow-[6px_6px_0px_0px_#000] transition-all duration-200">
        <CardContent className="p-6 text-center">
          {icon}
          <h3 className="font-bold text-xl mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
    
  );
}
