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
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Anonymous Messaging",
    description:
      "Send and receive messages without revealing your identity. Perfect for honest feedback and fun secrets.",
    icon: EyeOff,
    color: "bg-pink-500",
  },
  {
    title: "Privacy First",
    description:
      "Your data stays safe with end-to-end encryption and no unnecessary tracking.",
    icon: Shield,
    color: "bg-green-500",
  },
  {
    title: "Fun & Engaging",
    description:
      "Interactive UI with brutalist design that makes every message feel unique and exciting.",
    icon: Sparkles,
    color: "bg-yellow-400",
  },
  {
    title: "Easy Sharing",
    description:
      "Generate sharable links to invite friends and collect mystery messages effortlessly.",
    icon: Share2,
    color: "bg-blue-500",
  },
  {
    title: "Real-time Inbox",
    description:
      "Get instant updates as soon as someone sends you a new message.",
    icon: MessageCircle,
    color: "bg-purple-500",
  },
  {
    title: "Lightning Fast",
    description:
      "Optimized for speed so your messages load instantly, anywhere, anytime.",
    icon: Zap,
    color: "bg-red-500",
  },
];

export default function Features() {
  return (
    <div className="text-black flex flex-col min-h-screen bg-gradient-to-b from-emerald-50 via-white to-lime-50">
      {/* Features Section */}
      <section className="py-20 px-6 md:px-12 lg:px-20 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto text-center mb-16"
        >
          <h2 className="text-5xl font-extrabold tracking-tight mb-4">
           Key Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to make mystery messaging <b>fun</b>,{" "}
            <b>safe</b>, and <b>engaging</b>.
          </p>
        </motion.div>

        <div className=" grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <motion.div
              key={`${idx}-${feature.title}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, type: "spring", stiffness: 60 }}
              viewport={{ once: true }}
            >
              <Card className="text-white bg-[#08b584] group border-4 border-black shadow-[5px_5px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] transition-all duration-200 ">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div
                    className={`w-16 h-16 flex items-center justify-center rounded-xl mb-6 text-white ${feature.color}`}
                  >
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center p-6 bg-gray-900 text-gray-400 text-sm ">
        <p>© 2025 Mystery Message. All rights reserved.</p>
        <div className="mt-3 flex justify-center gap-6">
          <Link href="https://twitter.com" className="hover:text-white">
            Twitter
          </Link>
          <Link href="https://github.com" className="hover:text-white">
            GitHub
          </Link>
          <Link href="https://linkedin.com" className="hover:text-white">
            LinkedIn
          </Link>
        </div>
      </footer>
    </div>
  );
}
