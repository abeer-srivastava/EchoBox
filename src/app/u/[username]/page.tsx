"use client";

import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Sparkles, Send, User, Mail } from "lucide-react";
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
  const [message, setMessage] = useState("");
  const [publicMessages, setPublicMessages] = useState<any[]>([]);
  const [isFetchingMessages, setIsFetchingMessages] = useState(false);

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

  useEffect(() => {
    const fetchPublicMessages = async () => {
      setIsFetchingMessages(true);
      try {
        const response = await axios.get<ApiResponse>(`/api/get-messages?username=${username}`);
        setPublicMessages(response.data.messages || []);
      } catch (error) {
        console.error("Failed to fetch public messages", error);
      } finally {
        setIsFetchingMessages(false);
      }
    };
    fetchPublicMessages();
  }, [username]);

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });

      toast.success(response.data.message);
      form.reset({ content: "" });
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
    <div className="text-black container mx-auto my-12 p-6 max-w-4xl space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-black uppercase tracking-tighter bg-black text-white px-4 py-2 inline-block transform -rotate-1 shadow-[8px_8px_0px_0px_rgba(251,191,36,1)]">
          Echo Message
        </h1>
        <p className="text-2xl font-bold text-black/60 pt-4">
          Drop a secret note to{" "}
          <span className="bg-accent-yellow px-2 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">@{username}</span>
        </p>
      </div>

      {/* Message Form */}
      <Card className="border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none bg-white">
        <CardHeader className="bg-black text-white border-b-[4px] border-black">
          <CardTitle className="text-2xl font-black uppercase tracking-tight">
            Write Your Message ✨
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl font-black uppercase">Your Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write something fun, thoughtful, or secret..."
                        className="resize-none min-h-[140px] border-[3px] border-black rounded-none text-lg font-bold focus:ring-0 focus:border-black shadow-inner"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="font-bold text-accent-red" />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading || !messageContent}
                  className="bg-accent-yellow text-black border-[4px] border-black rounded-none px-8 py-6 text-xl font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-6 w-6" /> Send Message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Suggested Messages */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black uppercase tracking-tighter">Need Inspiration?</h2>
          <Button
            onClick={fetchSuggestedMessages}
            variant="neutral"
            disabled={isSuggestLoading}
            className="border-[3px] border-black rounded-none font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            {isSuggestLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Sparkles className="w-4 h-4 text-accent-yellow mr-2" />
            )}
            Suggest
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {error ? (
            <p className="text-accent-red font-bold">{error.message}</p>
          ) : (
            parseStringMessages(message || initialMessageString).map((msg, index) => (
              <button
                key={index}
                className="text-left p-4 border-[3px] border-black bg-white font-bold hover:bg-accent-yellow hover:translate-x-[2px] hover:translate-y-[2px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all"
                onClick={() => handleMessageClick(msg)}
              >
                {msg}
              </button>
            ))
          )}
        </div>
      </div>

      <Separator className="h-[4px] bg-black" />

      {/* Public Replies Section */}
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📢</span>
          <h2 className="text-4xl font-black uppercase tracking-tighter">Public Replies</h2>
        </div>
        
        {isFetchingMessages ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-black" />
          </div>
        ) : publicMessages.length > 0 ? (
          <div className="grid gap-10">
            {publicMessages.map((msg, index) => (
              <Card key={index} className="border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white rounded-none overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="text-[12px] font-black text-black uppercase mb-2 px-3 py-1 border-[3px] border-black w-fit bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    {dayjs(msg.createdAt).format('MMM D, YYYY')}
                  </div>
                  <CardTitle className="text-3xl font-black tracking-tight leading-none">{msg.content}</CardTitle>
                </CardHeader>
                <CardContent className="pt-2 pb-8">
                  <div className="mt-4 p-6 bg-accent-yellow border-[4px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 border-[3px] border-black bg-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black uppercase tracking-wider leading-none">Admin Reply</span>
                        <span className="text-[10px] font-bold text-black/50 mt-1 uppercase">
                          Replied {dayjs(msg.repliedAt).fromNow()}
                        </span>
                      </div>
                    </div>
                    <p className="font-black text-xl text-black leading-tight italic">"{msg.replyText}"</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border-[4px] border-dashed border-black bg-white/50 rounded-none">
            <Mail className="w-24 h-24 text-black/10 mx-auto mb-6" />
            <p className="text-2xl font-black uppercase tracking-widest text-black/20">No public replies yet</p>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <Card className="bg-black text-white border-[4px] border-black shadow-[12px_12px_0px_0px_rgba(251,191,36,1)] rounded-none overflow-hidden mt-20">
        <CardHeader className="p-10 text-center">
          <h3 className="text-4xl font-black uppercase tracking-tighter mb-4">
            Want your own Message Board?
          </h3>
          <p className="text-xl font-bold text-white/70 max-w-xl mx-auto mb-8">
            Create your account and start receiving anonymous messages today. It's free, fun, and completely anonymous.
          </p>
          <Link href={"/sign-up"}>
            <Button
              size="lg"
              className="bg-accent-yellow text-black border-[4px] border-black rounded-none px-12 py-8 text-2xl font-black uppercase shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
            >
              Get Started Now
            </Button>
          </Link>
        </CardHeader>
      </Card>
    </div>
  );
}
