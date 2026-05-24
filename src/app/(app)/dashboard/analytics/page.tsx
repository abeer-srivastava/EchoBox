"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Message } from "@/model/User";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { 
  BarChart3, 
  Loader2, 
  RefreshCcw, 
  MessageSquare, 
  Clock, 
  TrendingUp, 
  CheckCircle2,
  Calendar,
  Zap,
  Sparkles
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { motion } from "framer-motion";

dayjs.extend(relativeTime);

export default function AnalyticsPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");
      setMessages(response.data.messages || []);
      if (refresh) {
        toast.success("Analytics data updated!");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error", {
        description: axiosError.response?.data.message ?? "Failed to fetch analytics",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user) fetchMessages();
  }, [session, fetchMessages]);

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-8 border border-border bg-secondary-background rounded-2xl shadow-sm text-center max-w-md w-full"
        >
          <h2 className="text-2xl font-bold font-heading text-accent-red">Access Denied</h2>
          <p className="mt-2 text-sm text-muted">Please login to view your analytics dashboard.</p>
        </motion.div>
      </div>
    );
  }

  // Calculate Stats
  const totalMessages = messages.length;
  const replies = messages.filter(m => m.replyText && m.replyText.trim() !== "");
  const totalReplies = replies.length;
  const responseRatio = totalMessages > 0 ? Math.round((totalReplies / totalMessages) * 100) : 0;

  const latestMessage = messages.length > 0 
    ? dayjs(messages[0].createdAt).fromNow() 
    : "No messages yet";

  const latestReply = replies.length > 0
    ? dayjs(replies.sort((a,b) => dayjs(b.repliedAt).unix() - dayjs(a.repliedAt).unix())[0].repliedAt).fromNow()
    : "No replies yet";

  // Last 14 days activity
  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const date = dayjs().subtract(i, 'day');
    const dayMessages = messages.filter(m => dayjs(m.createdAt).isSame(date, 'day')).length;
    const dayReplies = messages.filter(m => m.repliedAt && dayjs(m.repliedAt).isSame(date, 'day')).length;
    return {
      label: i === 0 ? 'Today' : `${i}d`,
      messages: dayMessages,
      replies: dayReplies,
    };
  }).reverse();

  const maxVal = Math.max(...last14Days.map(d => Math.max(d.messages, d.replies)), 1);

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
                <BarChart3 className="w-6 h-6" />
             </div>
             <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-heading">Insights</h1>
          </div>
          <Button
            variant="outline"
            onClick={() => fetchMessages(true)}
            className="h-9 px-4 text-sm font-medium border border-border bg-transparent hover:bg-white/5 hover:border-white/15"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4 mr-1.5 text-brand-primary" />}
            Refresh
          </Button>
        </div>
        <p className="text-base text-muted max-w-xl">Real-time engagement metrics for your anonymous community.</p>
      </motion.header>

      <motion.div variants={itemVariants}>
        <Separator className="bg-border" />
      </motion.div>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Total Reach", subtitle: "All-time received messages", value: totalMessages, icon: <MessageSquare className="w-4 h-4" />, label: "Messages", accent: "bg-accent-blue" },
          { title: "Recent Vibe", subtitle: "Time since last message", value: latestMessage, icon: <Clock className="w-4 h-4" />, label: "Latest", accent: "bg-accent-green", isString: true },
          { title: "Vibe Check", subtitle: "Inbox reply percentage", value: `${responseRatio}%`, icon: <TrendingUp className="w-4 h-4" />, label: "Ratio", accent: "bg-accent-pink", isString: true }
        ].map((metric, i) => (
          <motion.div key={i} variants={itemVariants}>
            <MetricCard {...metric} />
          </motion.div>
        ))}
      </div>

      {/* Chart Section */}
      <motion.div variants={itemVariants}>
        <Card className="bg-secondary-background border border-border rounded-2xl shadow-sm overflow-hidden">
          <CardHeader className="border-b border-border p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-brand-primary/5">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-primary" />
                Growth Velocity
              </CardTitle>
              <p className="text-xs text-muted">Comparing message volume and published replies over 14 days.</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
                <span className="text-muted">Messages</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-accent-blue" />
                <span className="text-muted">Replies</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 flex flex-col gap-10">
            {/* Messages Bar Chart */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-brand-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted">Daily Inbound Flow</span>
              </div>
              <div className="flex items-end justify-between h-40 gap-1.5">
                {last14Days.map((day, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group/bar">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.messages / maxVal) * 100}%` }}
                      transition={{ delay: 0.2 + (idx * 0.03), duration: 0.4, ease: "easeOut" }}
                      className="w-full bg-brand-primary rounded-t-md relative cursor-default transition-opacity hover:opacity-85"
                      style={{ minHeight: '4px' }}
                    >
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-0.5 rounded text-[10px] font-semibold opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-sm border border-border">
                          {day.messages} MSG
                       </div>
                    </motion.div>
                    <span className="text-[9px] font-semibold text-muted tracking-tighter">{day.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="border-dashed" />

            {/* Replies Bar Chart */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-accent-blue" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted">Daily Public Output</span>
              </div>
              <div className="flex items-end justify-between h-40 gap-1.5">
                {last14Days.map((day, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group/bar">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.replies / maxVal) * 100}%` }}
                      transition={{ delay: 0.3 + (idx * 0.03), duration: 0.4, ease: "easeOut" }}
                      className="w-full bg-accent-blue rounded-t-md relative cursor-default transition-opacity hover:opacity-85"
                      style={{ minHeight: '4px' }}
                    >
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-0.5 rounded text-[10px] font-semibold opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-sm border border-border">
                          {day.replies} REP
                       </div>
                    </motion.div>
                    <span className="text-[9px] font-semibold text-muted tracking-tighter">{day.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <motion.div variants={itemVariants}>
          <MetricCard 
            title="Lifetime Output" 
            subtitle="Total published replies across your profile" 
            value={totalReplies} 
            icon={<CheckCircle2 className="w-4 h-4" />}
            label="Total"
            accent="bg-background"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricCard 
            title="Last Activity" 
            subtitle="Time since your last public reply" 
            value={latestReply} 
            icon={<Clock className="w-4 h-4" />}
            label="Recency"
            accent="bg-background"
            isString
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

function MetricCard({ 
  title, 
  subtitle, 
  value, 
  icon, 
  label, 
  isString = false 
}: { 
  title: string, 
  subtitle: string, 
  value: string | number, 
  icon: React.ReactNode, 
  label: string,
  accent: string,
  isString?: boolean
}) {
  return (
    <Card className={`bg-secondary-background border border-border rounded-2xl shadow-sm h-full`}>
      <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
        <CardTitle className="text-base font-bold font-heading">{title}</CardTitle>
        <div className={`p-2 bg-brand-primary/10 rounded-xl text-brand-primary shrink-0`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-2 flex flex-col gap-3">
        <div className="flex items-end justify-between border-b border-border pb-2">
          <span className={`font-bold font-heading tracking-tight ${isString ? 'text-2xl' : 'text-5xl'}`}>
            {value}
          </span>
          <span className="text-[10px] font-semibold text-muted uppercase tracking-wider">{label}</span>
        </div>
        <p className="text-xs text-muted leading-snug">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
