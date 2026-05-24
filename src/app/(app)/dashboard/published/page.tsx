"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Message } from "@/model/User";
import { ApiResponse } from "@/types/ApiResponse";
import axios from "axios";
import { Loader2, RefreshCcw, Mail, Sparkles, Globe } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

function PublishedPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        const allMessages = response.data.messages || [];
        const publishedMessages = allMessages.filter(
          (msg) => msg.replyText && msg.replyText.trim() !== ""
        );
        setMessages(publishedMessages);
        if (refresh) {
          toast.success("Public feed refreshed!");
        }
      } catch {
        toast.error("Failed to sync published messages");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
  }, [session, fetchMessages]);

  if (!session || !session.user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-8 border border-border bg-secondary-background rounded-2xl shadow-sm text-center max-w-md w-full"
        >
          <h2 className="text-2xl font-bold font-heading text-accent-red">Access Denied</h2>
          <p className="mt-2 text-sm text-muted">Log in to manage your public message showcase.</p>
        </motion.div>
      </div>
    );
  }

  const { username } = session.user as User;

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-brand-primary/10 rounded-xl text-brand-primary">
                <Globe className="w-6 h-6" />
             </div>
             <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-heading">Showcase</h1>
          </div>
          <Button
            variant="outline"
            className="h-9 px-4 text-sm font-medium border border-border bg-transparent hover:bg-white/5 hover:border-white/15"
            onClick={() => fetchMessages(true)}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4 mr-1.5 text-brand-primary" />}
            Refresh
          </Button>
        </div>
        <p className="text-base text-muted max-w-xl">These messages and your replies are visible on your public profile. Curate your vibe.</p>
      </motion.header>

      <motion.div variants={itemVariants}>
        <Separator className="bg-border" />
      </motion.div>

      {/* Messages Section */}
      <div className="flex flex-col gap-6">
        <motion.div variants={itemVariants} className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-primary" />
          <h2 className="text-lg font-bold font-heading">Public Feed ({messages.length})</h2>
        </motion.div>
        
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-20"
            >
              <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
            </motion.div>
          ) : messages.length > 0 ? (
            <motion.div 
              key="grid"
              layout
              className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start"
            >
              {messages.map((message, i) => (
                <motion.div
                  key={message._id as string}
                  layout
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <MessageCard
                    message={message}
                    username={username}
                    onMessageDelete={(id) =>
                      setMessages(messages.filter((msg) => msg._id !== id))
                    }
                    onReplyUpdate={(id, replyText) => {
                      if (!replyText) {
                        setMessages(messages.filter((msg) => msg._id !== id));
                      }
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-20 flex flex-col items-center justify-center border border-dashed border-border bg-secondary-background/10 rounded-2xl relative overflow-hidden"
            >
              <div className="p-4 bg-brand-primary/5 border border-border border-dashed rounded-xl mb-4">
                <Mail className="w-10 h-10 text-muted/30" />
              </div>
              <p className="text-lg font-bold font-heading">Feed is empty</p>
              <p className="text-xs text-muted mt-1.5 max-w-xs text-center leading-relaxed">Reply to messages in your private inbox to showcase them here on your profile!</p>
              <Button 
                variant="outline"
                className="mt-6 text-sm font-medium"
                asChild
              >
                <Link href="/dashboard">Go to Inbox</Link>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default PublishedPage;
