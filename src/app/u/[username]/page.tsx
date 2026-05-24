"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Sparkles, Send, User, Mail, MessageCircle } from "lucide-react";
import { Message } from "@/model/User";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompletion } from "@ai-sdk/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import * as z from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import { useParams } from "next/navigation";
import { messageSchema } from "@/schemas/messageSchema";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const specialChar = "||";

const parseStringMessages = (messageString: string): string[] =>
  messageString.split(specialChar).filter(Boolean);

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const [publicMessages, setPublicMessages] = useState<Message[]>([]);
  const [isFetchingMessages, setIsFetchingMessages] = useState(false);
  const [privacyType, setPrivacyType] = useState<'anonymous-only' | 'allow-named'>('anonymous-only');
  const [senderName, setSenderName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const {
    isLoading: isSuggestLoading,
    error,
    complete,
  } = useCompletion({
    api: "/api/suggest-messages",
    initialCompletion: initialMessageString,
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: ""
    }
  });

  const messageContent = form.watch("content");
  const [isLoading, setIsLoading] = useState(false);

  const fetchPublicData = useCallback(async (pageNum: number = 1) => {
    setIsFetchingMessages(true);
    try {
      const response = await axios.get<ApiResponse & { privacyType?: 'anonymous-only' | 'allow-named'; pagination?: { totalPages: number } }>(
        `/api/get-messages?username=${username}&page=${pageNum}&limit=5`
      );
      setPublicMessages(response.data.messages || []);
      if (response.data.privacyType) {
        setPrivacyType(response.data.privacyType);
      }
      if (response.data.pagination) {
        setTotalPages(response.data.pagination.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to fetch public data", error);
    } finally {
      setIsFetchingMessages(false);
    }
  }, [username]);

  useEffect(() => {
    fetchPublicData(currentPage);
  }, [username, currentPage, fetchPublicData]);

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
        senderName: privacyType === 'allow-named' ? senderName : undefined,
      });

      toast.success(response.data.message);
      form.reset({ content: "" });
      setSenderName("");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error", {
        description:
          axiosError.response?.data.message ?? "Failed to send message",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    try {
      complete("");
    } catch (error) {
      console.error("Error fetching suggestions", error);
    }
  };

  return (
    <div className="text-foreground container mx-auto my-12 p-6 max-w-4xl space-y-12 bg-background">
      {/* Hero Section */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-6 h-6 text-brand-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Send Anonymous Message
        </h1>
        <p className="text-sm text-muted">
          Drop a secret note to{" "}
          <span className="text-brand-primary font-semibold">@{username}</span>
        </p>
      </div>

      {/* Message Form */}
      <Card className="bg-secondary-background border border-border rounded-2xl shadow-lg">
        <CardHeader className="border-b border-border p-6">
          <CardTitle className="text-lg font-semibold">
            Write Your Message
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {privacyType === 'allow-named' && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Your Name (Optional)</label>
                  <Input
                    placeholder="Enter your name or stay anonymous..."
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="bg-background"
                  />
                </div>
              )}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground">Your Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write something fun, thoughtful, or secret..."
                        className="resize-none min-h-[120px] bg-background border border-border rounded-xl font-medium focus:ring-1 focus:ring-brand-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-accent-red font-medium" />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading || !messageContent}
                  className="rounded-xl px-6"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-1.5" /> Send Message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Suggested Messages */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Need Inspiration?</h2>
          <Button
            onClick={fetchSuggestedMessages}
            variant="outline"
            size="sm"
            disabled={isSuggestLoading}
            className="rounded-xl"
          >
            {isSuggestLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-accent-yellow mr-1.5" />
            )}
            Suggest
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {error ? (
            <p className="text-accent-red text-sm font-medium">{error.message}</p>
          ) : (
            parseStringMessages(initialMessageString).map((msg, index) => (
              <button
                key={index}
                className="text-left p-4 border border-border bg-secondary-background rounded-xl text-sm font-medium hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all"
                onClick={() => handleMessageClick(msg)}
              >
                {msg}
              </button>
            ))
          )}
        </div>
      </div>

      <Separator className="bg-border" />

      {/* Public Replies Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <span className="text-xl">📢</span>
          <h2 className="text-xl font-bold">Public Replies</h2>
        </div>
        
        {isFetchingMessages ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
          </div>
        ) : publicMessages.length > 0 ? (
          <div className="grid gap-6">
            {publicMessages.map((msg, index) => (
              <Card key={index} className="border border-border bg-secondary-background rounded-2xl overflow-hidden shadow-sm">
                <CardHeader className="p-6 pb-3">
                  <div className="text-[10px] font-semibold text-muted uppercase flex gap-2 mb-3">
                    <span className="px-2.5 py-0.5 border border-border bg-white/5 rounded-md">
                      {dayjs(msg.createdAt).format('MMM D, YYYY')}
                    </span>
                    {msg.senderName && (
                      <span className="px-2.5 py-0.5 border border-brand-primary/20 bg-brand-primary/10 text-brand-primary rounded-md">
                        FROM: {msg.senderName}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-lg font-bold leading-normal break-words">{msg.content}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 pb-6">
                  <div className="p-4 bg-background border border-border rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col leading-tight">
                        <span className="text-xs font-semibold">Admin Reply</span>
                        <span className="text-[9px] text-muted font-medium uppercase mt-0.5">
                          Replied {dayjs(msg.repliedAt).fromNow()}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm font-medium leading-relaxed italic text-foreground/90">&quot;{msg.replyText}&quot;</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-border bg-secondary-background/30 rounded-2xl">
            <Mail className="w-12 h-12 text-muted/10 mx-auto mb-3" />
            <p className="text-sm font-semibold text-muted">No public replies yet</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2 items-center">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1 || isFetchingMessages}
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
              disabled={currentPage === totalPages || isFetchingMessages}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <Card className="bg-secondary-background border border-border rounded-2xl overflow-hidden mt-12 p-8 flex flex-col items-center text-center">
        <h3 className="text-xl font-bold mb-2">
          Want your own Message Board?
        </h3>
        <p className="text-sm text-muted max-w-md mb-6">
          Create your account and start receiving anonymous messages today. It&apos;s free, fun, and completely anonymous.
        </p>
        <Link href={"/sign-up"}>
          <Button className="rounded-xl px-8">
            Get Started Now
          </Button>
        </Link>
      </Card>
    </div>
  );
}
