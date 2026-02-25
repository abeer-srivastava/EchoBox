"use client"
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessage";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw, Copy, QrCode, Mail, Settings2 } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";


import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [privacyType, setPrivacyType] = useState<'anonymous-only' | 'allow-named'>('anonymous-only');
  const [isPrivacyLoading, setIsPrivacyLoading] = useState(false);

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchSettings = useCallback(async () => {
    setIsSwitchLoading(true);
    setIsPrivacyLoading(true);
    try {
      const response = await axios.get("/api/account");
      if (response.data.success) {
        setValue("acceptMessages", response.data.isAcceptingMessages ?? false);
        setPrivacyType(response.data.privacyType || 'anonymous-only');
      }
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: "Failed to fetch settings",
      });
    } finally {
      setIsSwitchLoading(false);
      setIsPrivacyLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast("Refreshed Messages", {
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.warning("Error", {
          description:
            axiosError.response?.data.message ?? "Failed to fetch messages",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchSettings();
  }, [session, setValue, fetchMessages, fetchSettings]);

  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.post(`/api/account`, {
        isAcceptingMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast.info(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.warning("Error", {
        description:
          axiosError.response?.data.message ?? "Failed to update status",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  const handlePrivacyChange = async (type: 'anonymous-only' | 'allow-named') => {
    setIsPrivacyLoading(true);
    try {
      const response = await axios.post("/api/account", { privacyType: type });
      if (response.data.success) {
        setPrivacyType(type);
        toast.success("Privacy updated", {
          description: `Mode changed to ${type === 'anonymous-only' ? 'Anonymous Only' : 'Allow Named'}`,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: "Failed to update privacy settings",
      });
    } finally {
      setIsPrivacyLoading(false);
    }
  };

  if (!session || !session.user) {
    return <div className="text-center mt-20 font-black text-2xl">Please Login</div>;
  }

  const { username } = session.user as User;
  const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : '';
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast("URL Copied!", {
      description: "Profile URL has been copied to clipboard.",
    });
  };

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-5xl font-black uppercase tracking-tighter">Your Inbox</h1>
          <Button
            variant="neutral"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCcw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
        <p className="text-xl font-bold text-black/60">Manage your anonymous messages and sharing settings.</p>
      </header>

      {/* Share Link Card */}
      <Card className="bg-background">
        <CardHeader className="h-full bg-accent-yellow border-b-[3px] border-border p-8 flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-black uppercase">Share Your Link</CardTitle>
          <div className="px-3 py-1 bg-white border-[3px] border-black text-xs font-black shadow-brutal-sm">ACTIVE</div>
        </CardHeader>
        <CardContent className="p-8 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 flex flex-col gap-4 w-full">
            <p className="font-bold">Copy your unique profile link and share it on social media to start receiving anonymous feedback.</p>
            <div className="flex gap-2">
              <Input
                type="text"
                value={profileUrl}
                readOnly
                className="bg-secondary-background"
              />
              <Button onClick={copyToClipboard} variant="default" className="shrink-0">
                <Copy className="h-5 w-5 mr-2" /> Copy
              </Button>
            </div>
          </div>
          
          <Separator orientation="vertical" className="hidden md:block h-32" />
          
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="p-4 border-[3px] border-border bg-white shadow-brutal-md">
              <QrCode className="w-24 h-24" />
            </div>
            <span className="text-xs font-black uppercase">QR Code</span>
          </div>
        </CardContent>
      </Card>

      {/* Settings Row */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-accent-green/20">
          <CardContent className="p-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 border-[3px] border-border bg-accent-green shadow-brutal-sm">
                <Mail className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-black uppercase text-sm">Accept Messages</span>
                <span className="font-bold text-black/60">{acceptMessages ? "Publicly Open" : "Currently Closed"}</span>
              </div>
            </div>
            <Switch
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
            />
          </CardContent>
        </Card>

        <Card className="bg-accent-pink/20">
          <CardContent className="p-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 border-[3px] border-border bg-accent-pink shadow-brutal-sm">
                <Settings2 className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-black uppercase text-sm">Profile Privacy</span>
                <span className="font-bold text-black/60">
                  {isPrivacyLoading ? "Updating..." : (privacyType === 'anonymous-only' ? "Anonymous Only" : "Anonymous or Named")}
                </span>
              </div>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="neutral" size="sm" disabled={isPrivacyLoading}>
                  {isPrivacyLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Edit"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border-[4px] border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-3xl font-black uppercase tracking-tighter">Choose Message Privacy</AlertDialogTitle>
                  <AlertDialogDescription className="font-bold text-black/60">
                    Control whether senders can display their name with their messages.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid gap-4 py-4">
                  <Button 
                    variant={privacyType === 'anonymous-only' ? 'default' : 'neutral'}
                    className="w-full justify-start text-lg font-black uppercase p-8 rounded-none border-[3px] border-black shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                    onClick={() => handlePrivacyChange('anonymous-only')}
                  >
                    Anonymous Only
                  </Button>
                  <Button 
                    variant={privacyType === 'allow-named' ? 'default' : 'neutral'}
                    className="w-full justify-start text-lg font-black uppercase p-8 rounded-none border-[3px] border-black shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                    onClick={() => handlePrivacyChange('allow-named')}
                  >
                    Anonymous or Named
                  </Button>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-[3px] border-black rounded-none font-black uppercase tracking-tighter">Close</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Messages Section */}
      <div className="flex flex-col gap-6">
        <h2 className="text-3xl font-black uppercase tracking-tighter">📩 Received Messages</h2>
        {messages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {messages.map((message) => (
              <MessageCard
                key={message._id as string}
                message={message}
                username={username}
                onMessageDelete={(id) =>
                  setMessages(messages.filter((msg) => msg._id !== id))
                }
                onReplyUpdate={(id, replyText) =>
                  setMessages(messages.map((msg) =>
                    String(msg._id) === id
                      ? { ...msg, replyText: replyText, repliedAt: replyText ? new Date() : undefined } as Message
                      : msg
                  ))
                }
              />
            ))}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center border-[3px] border-dashed border-border bg-white/50 rounded-base">
            <Mail className="w-16 h-16 text-black/20 mb-4" />
            <p className="text-xl font-bold text-black/40">No messages to display yet.</p>
            <p className="font-bold text-black/30">Share your link to get started!</p>
          </div>
        )}
      </div>
      
      {/* Pagination Placeholder */}
      <div className="flex justify-center mt-8 gap-2">
        <Button variant="neutral" size="sm" disabled>Previous</Button>
        <Button variant="default" size="sm">1</Button>
        <Button variant="neutral" size="sm">2</Button>
        <Button variant="neutral" size="sm">Next</Button>
      </div>
    </div>
  );
}

export default Dashboard;
