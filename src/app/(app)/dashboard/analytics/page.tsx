"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
  Calendar
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="p-8 border-[4px] border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
          <h2 className="text-3xl font-black uppercase">Access Denied</h2>
          <p className="mt-2 font-bold text-black/60">Please login to view your analytics.</p>
        </div>
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

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto">
      {/* Header */}
      <header className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="p-3 border-[3px] border-black bg-accent-yellow shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <BarChart3 className="w-8 h-8 text-black" />
             </div>
             <div className="flex flex-col">
               <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">Analytics</h1>
             </div>
          </div>
          <button
            onClick={() => fetchMessages(true)}
            className="p-3 border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCcw className="w-5 h-5" />}
          </button>
        </div>
        <p className="text-xl font-bold text-black/60 mt-1">Activity overview for your inbox.</p>
      </header>

      <Separator className="h-[3px] bg-black" />

      {/* Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard 
          title="Messages" 
          subtitle="All time received" 
          value={totalMessages} 
          icon={<MessageSquare className="w-6 h-6" />}
          label="Total"
          accent="bg-accent-blue"
        />
        <MetricCard 
          title="Latest Message" 
          subtitle="Received" 
          value={latestMessage} 
          icon={<Clock className="w-6 h-6" />}
          label="Recency"
          accent="bg-accent-green"
          isString
        />
        <MetricCard 
          title="Response Ratio" 
          subtitle="Replies as a share of total messages" 
          value={`${responseRatio}%`} 
          icon={<TrendingUp className="w-6 h-6" />}
          label="Replies"
          accent="bg-accent-pink"
          isString
        />
      </div>

      {/* Chart Section */}
      <Card className="border-[4px] border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
        <CardHeader className="border-b-[4px] border-black p-6 flex flex-row items-center justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Last 14 Days
            </CardTitle>
            <p className="font-bold text-black/60">Compare message volume and replies over time.</p>
          </div>
          <div className="flex items-center gap-4 font-black uppercase text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent-blue border-[2px] border-black" />
              <span>Messages</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent-pink border-[2px] border-black" />
              <span>Replies</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8 flex flex-col gap-12">
          {/* Messages Bar Chart */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-black uppercase tracking-widest text-black/40">Messages Received</span>
            <div className="flex items-end justify-between h-48 gap-2">
              {last14Days.map((day, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
                  <div 
                    className="w-full bg-accent-blue border-[3px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 relative"
                    style={{ height: `${(day.messages / maxVal) * 100}%`, minHeight: '8px' }}
                  >
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-0.5 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {day.messages} MSG
                     </div>
                  </div>
                  <span className="text-[10px] font-black uppercase text-black/40">{day.label}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator className="h-[2px] bg-black/10" />

          {/* Replies Bar Chart */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-black uppercase tracking-widest text-black/40">Replies Sent</span>
            <div className="flex items-end justify-between h-48 gap-2">
              {last14Days.map((day, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
                  <div 
                    className="w-full bg-accent-pink border-[3px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 relative"
                    style={{ height: `${(day.replies / maxVal) * 100}%`, minHeight: '8px' }}
                  >
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-0.5 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {day.replies} REP
                     </div>
                  </div>
                  <span className="text-[10px] font-black uppercase text-black/40">{day.label}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <MetricCard 
          title="Replies Total" 
          subtitle="Total replies created in your inbox" 
          value={totalReplies} 
          icon={<CheckCircle2 className="w-6 h-6" />}
          label="All Time"
          accent="bg-white"
        />
        <MetricCard 
          title="Latest Reply" 
          subtitle="Published" 
          value={latestReply} 
          icon={<Clock className="w-6 h-6" />}
          label="Recency"
          accent="bg-white"
          isString
        />
      </div>
    </div>
  );
}

function MetricCard({ 
  title, 
  subtitle, 
  value, 
  icon, 
  label, 
  accent,
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
    <Card className={`border-[4px] border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none bg-white p-2`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-black uppercase tracking-tight">{title}</CardTitle>
        <div className={`p-2 border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${accent}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="pt-4 flex flex-col gap-4">
        <div className="flex flex-col">
          <div className="flex items-end justify-between">
            <span className={`font-black tracking-tighter uppercase leading-none ${isString ? 'text-3xl' : 'text-6xl'}`}>
              {value}
            </span>
            <span className="text-[10px] font-black uppercase text-black/40 tracking-widest">{label}</span>
          </div>
          <p className="mt-3 font-bold text-black/50 text-sm leading-tight">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
}
