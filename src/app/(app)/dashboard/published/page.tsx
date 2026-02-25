"use client"
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
import { Message } from "@/model/User";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw, Mail, CheckCircle2 } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

function PublishedPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = useSession();

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        // Filter only messages that have a reply
        const allMessages = response.data.messages || [];
        const publishedMessages = allMessages.filter(
          (msg) => msg.replyText && msg.replyText.trim() !== ""
        );
        setMessages(publishedMessages);
        if (refresh) {
          toast.success("Refreshed Published Messages");
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error("Error", {
          description:
            axiosError.response?.data.message ?? "Failed to fetch messages",
        });
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="p-8 border-[4px] border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
          <h2 className="text-3xl font-black uppercase">Please Login</h2>
          <p className="mt-2 font-bold text-black/60">You need to be authenticated to view your published messages.</p>
        </div>
      </div>
    );
  }

  const { username } = session.user as User;

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto">
      {/* Header */}
      <header className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="bg-accent-yellow p-3 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <CheckCircle2 className="w-8 h-8 text-black" />
             </div>
             <h1 className="text-5xl font-black uppercase tracking-tighter">Published</h1>
          </div>
          <Button
            variant="neutral"
            size="sm"
            className="border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-bold"
            onClick={() => fetchMessages(true)}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCcw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
        <p className="text-xl font-bold text-black/60">Replies are public by default. These messages are visible on your profile.</p>
      </header>

      <div className="h-[3px] bg-black w-full" />

      {/* Messages Section */}
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <span className="text-3xl"><Mail className="w-8 h-8 text-black" /></span>
          <h2 className="text-3xl font-black uppercase tracking-tighter">Public Replies</h2>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-black" />
          </div>
        ) : messages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {messages.map((message) => (
              <MessageCard
                key={message._id as string}
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
            ))}
          </div>
        ) : (
          <div className="py-24 flex flex-col items-center justify-center border-[4px] border-dashed border-black bg-white/50 rounded-none relative overflow-hidden">
             <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <Mail className="w-20 h-20 text-black/20 mb-6" />
            <p className="text-2xl font-black uppercase text-black/40">No published messages yet.</p>
            <p className="font-bold text-black/30 mt-2">Reply to a message in your inbox to publish it!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PublishedPage;
