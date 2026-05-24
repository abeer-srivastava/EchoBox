"use client";
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
import { Loader2, RefreshCcw, Copy, Mail, Settings2, Sparkles, LayoutDashboard } from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);

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
    async (refresh: boolean = false, pageNum: number = 1) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse & { pagination?: { totalPages: number; totalMessages: number } }>(
          `/api/get-messages?page=${pageNum}&limit=10`
        );
        setMessages(response.data.messages || []);
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.totalPages || 1);
          setTotalMessages(response.data.pagination.totalMessages || 0);
        }
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
    fetchMessages(false, currentPage);
    fetchSettings();
  }, [session, currentPage, fetchMessages, fetchSettings]);

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
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 bg-background">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-brand-primary" />
        </motion.div>
        <h2 className="text-xl font-semibold">Please Login to Access Dashboard</h2>
        <Button asChild>
          <a href="/sign-in">Sign In Now</a>
        </Button>
      </div>
    );
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
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
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col gap-8 max-w-6xl mx-auto p-4 md:p-0"
    >
      {/* Header */}
      <motion.header variants={itemVariants} className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-primary/10 flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-brand-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Your Inbox</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true, currentPage);
            }}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCcw className="h-4 w-4 mr-2 text-brand-primary" />
            )}
            Refresh
          </Button>
        </div>
        <p className="text-sm text-muted">Manage your anonymous messages and sharing settings.</p>
      </motion.header>

      {/* Share Link Card */}
      <motion.div variants={itemVariants}>
        <Card className="bg-secondary-background border border-border rounded-2xl shadow-sm overflow-hidden group">
          <CardHeader className="bg-brand-primary/5 border-b border-border p-6 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              Share Your Link <Sparkles className="w-5 h-5 text-accent-yellow animate-pulse" />
            </CardTitle>
            <div className="px-2.5 py-0.5 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 text-xs font-semibold rounded-full">
              ACTIVE
            </div>
          </CardHeader>
          <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 flex flex-col gap-4 w-full">
              <p className="text-sm text-muted font-medium">Copy your unique profile link and share it on social media to start receiving anonymous feedback.</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    value={profileUrl}
                    readOnly
                    className="bg-background pl-10 h-11"
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                </div>
                <Button 
                  onClick={copyToClipboard} 
                  variant="default" 
                  className="shrink-0 h-11 px-5"
                >
                  <Copy className="h-4 w-4 mr-2" /> Copy Link
                </Button>
              </div>
            </div>
            
            <Separator orientation="vertical" className="hidden md:block h-16 w-[1px] bg-border" />
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex flex-col items-center gap-2 shrink-0 cursor-pointer"
            >
              <div className="p-3 border border-border bg-white rounded-xl flex items-center justify-center">
                <QRCodeSVG value={profileUrl || 'https://echobox.app'} size={100} />
              </div>
              <span className="text-[10px] font-semibold text-muted tracking-wider uppercase">Scan QR Code</span>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Settings Row */}
      <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-4">
        <Card className="bg-secondary-background border border-border rounded-2xl shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] font-semibold text-muted uppercase tracking-wider">Inbox Status</span>
                <span className="text-base font-semibold text-foreground mt-0.5">{acceptMessages ? "Open for messages" : "Currently Closed"}</span>
              </div>
            </div>
            <Switch
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
            />
          </CardContent>
        </Card>

        <Card className="bg-secondary-background border border-border rounded-2xl shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-accent-blue/10 text-accent-blue flex items-center justify-center">
                <Settings2 className="w-5 h-5" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] font-semibold text-muted uppercase tracking-wider">Privacy Mode</span>
                <span className="text-base font-semibold text-foreground mt-0.5">
                  {isPrivacyLoading ? "Updating..." : (privacyType === 'anonymous-only' ? "Anonymous Only" : "Mixed Mode")}
                </span>
              </div>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={isPrivacyLoading}
                  className="rounded-xl"
                >
                  {isPrivacyLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Change"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border border-border rounded-2xl bg-secondary-background max-w-md p-6">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl font-bold">Privacy Settings</AlertDialogTitle>
                  <AlertDialogDescription className="text-sm text-muted">
                    Control how people interact with your profile.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid gap-3 py-4">
                  <Button 
                    variant={privacyType === 'anonymous-only' ? 'default' : 'outline'}
                    className="w-full justify-start p-5 rounded-xl border border-border flex items-center gap-3"
                    onClick={() => handlePrivacyChange('anonymous-only')}
                  >
                    <div className={`w-4 h-4 rounded-full border ${privacyType === 'anonymous-only' ? 'bg-brand-primary' : 'bg-transparent'}`} />
                    Anonymous Only
                  </Button>
                  <Button 
                    variant={privacyType === 'allow-named' ? 'default' : 'outline'}
                    className="w-full justify-start p-5 rounded-xl border border-border flex items-center gap-3"
                    onClick={() => handlePrivacyChange('allow-named')}
                  >
                    <div className={`w-4 h-4 rounded-full border ${privacyType === 'allow-named' ? 'bg-brand-primary' : 'bg-transparent'}`} />
                    Allow Named Messages
                  </Button>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel className="w-full rounded-xl bg-foreground text-background font-semibold hover:opacity-95">Done</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Separator className="bg-border" />
      </motion.div>

      {/* Messages Section */}
      <motion.div variants={itemVariants} className="flex flex-col gap-6 pb-16">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Mail className="w-5 h-5 text-brand-primary" /> Received Messages
            <span className="ml-2 px-2.5 py-0.5 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 text-xs font-semibold rounded-md">
              {totalMessages}
            </span>
          </h2>
        </div>

        <AnimatePresence mode="popLayout">
          {messages.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start"
            >
              {messages.map((message, i) => (
                <motion.div
                  key={message._id as string}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                  transition={{ delay: i * 0.03, type: "spring", stiffness: 120, damping: 14 }}
                >
                  <MessageCard
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
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 flex flex-col items-center justify-center border border-dashed border-border bg-secondary-background/30 rounded-2xl"
            >
              <div className="relative mb-6">
                <Mail className="w-16 h-16 text-muted/10 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <RefreshCcw className="w-6 h-6 text-muted/30" />
                </div>
              </div>
              <p className="text-lg font-semibold text-muted">Your inbox is empty</p>
              <p className="text-xs text-muted/60 mt-1">Share your link to start receiving feedback!</p>
              <Button 
                variant="outline" 
                className="mt-6 rounded-xl"
                onClick={copyToClipboard}
              >
                Copy Profile Link
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <motion.div variants={itemVariants} className="flex justify-center mt-auto pb-8 gap-2 items-center">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1 || isLoading}
          >
            Prev
          </Button>
          <span className="text-sm font-semibold text-muted px-3">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || isLoading}
          >
            Next
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

export default Dashboard;
