'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, ArrowRight, Shield, UserCheck, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/message.json';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-emerald-50 via-white to-lime-50 text-black">
      
      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 md:px-16 py-20 relative overflow-hidden">
        
        {/* Background Glow Effect */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-emerald-400 rounded-full blur-[120px] opacity-40 animate-pulse"></div>
          <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-lime-400 rounded-full blur-[120px] opacity-30 animate-pulse"></div>
        </div>

        <motion.section 
          className="text-center max-w-3xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight font-mono bg-gradient-to-r from-green-600 via-emerald-500 to-lime-600 bg-clip-text text-transparent drop-shadow-lg">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="text-base md:text-lg text-gray-700 mb-6">
            Mystery Message – Where your identity remains a secret.
          </p>
          <Button 
            asChild 
            size="lg" 
            className="rounded-2xl transition-transform transform hover:scale-105 hover:shadow-lg"
          >
            <Link href="/sign-up">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.section>

        {/* Carousel Section */}
        <motion.section 
          className="mt-20 w-full max-w-xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <Carousel plugins={[Autoplay({ delay: 3000 })]}>
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-2">
                  <motion.div whileHover={{ scale: 1.03 }}>
                    <Card className="shadow-lg rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-md transition-all">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Mail className="w-5 h-5 text-emerald-500" />
                          {message.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{message.content}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {message.received}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          className="mt-20 grid gap-6 md:grid-cols-3 max-w-5xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {[
            {
              icon: <Shield className="w-10 h-10 mx-auto mb-4 text-green-600" />,
              title: "100% Anonymous",
              desc: "Your identity stays hidden, always."
            },
            {
              icon: <UserCheck className="w-10 h-10 mx-auto mb-4 text-emerald-500" />,
              title: "Easy to Use",
              desc: "Start sharing and receiving feedback instantly."
            },
            {
              icon: <Zap className="w-10 h-10 mx-auto mb-4 text-lime-600" />,
              title: "Engaging",
              desc: "Fun way to connect and interact with your friends."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="transition"
            >
              <Card className="p-6 text-center shadow-md hover:shadow-xl border border-gray-200 bg-white/70 backdrop-blur-sm">
                {feature.icon}
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </Card>
            </motion.div>
          ))}
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="text-center p-6 bg-gray-900 text-gray-400 text-sm">
        <p>© 2025 Mystery Message. All rights reserved.</p>
        <div className="mt-2 flex justify-center gap-4">
          <Link href="https://twitter.com" className="hover:text-white transition">Twitter</Link>
          <Link href="https://github.com" className="hover:text-white transition">GitHub</Link>
          <Link href="https://linkedin.com" className="hover:text-white transition">LinkedIn</Link>
        </div>
      </footer>
    </div>
  );
}
