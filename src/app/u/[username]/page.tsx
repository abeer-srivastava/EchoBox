"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Sparkles, Send } from "lucide-react";
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

const specialChar = "||";

const parseStringMessages = (messageString: string): string[] =>
  messageString.split(specialChar).filter(Boolean);

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const [message, setMessage] = useState("");

  const {
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: "/api/suggest-messages",
    initialCompletion: initialMessageString,
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch("content");
  const [isLoading, setIsLoading] = useState(false);

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

      toast.success(response.data.message, {
        description: response.data.message,
      });
      form.reset({ ...form.getValues(), content: "" });
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
    const response = await axios.post("/api/suggest-message");
    setMessage(response.data);
  };

  return (
    <div className="text-black container mx-auto my-12 p-6 max-w-3xl space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold  bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
          Send a Mystery Message
        </h1>
        <p className="text-gray-600 text-lg">
          Drop a secret note to{" "}
          <span className="font-bold text-blue-600">@{username}</span>
        </p>
      </div>

      {/* Message Form */}
      <Card className="border shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Write Your Message ✨
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-700">
                      Your Message
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write something fun, thoughtful, or secret..."
                        className="resize-none min-h-[120px] focus:ring-2 focus:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading || !messageContent}
                  className="rounded-xl flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Send Message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Suggested Messages */}
      <div className="text-black space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Need Inspiration?</h2>
          <Button
            onClick={fetchSuggestedMessages}
            variant="default"
            disabled={isSuggestLoading}
            className="flex items-center gap-2 rounded-xl"
          >
            {isSuggestLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Loading...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-yellow-500" /> Suggest
              </>
            )}
          </Button>
        </div>

        <Card className="shadow-sm border rounded-xl">
          <CardContent className="flex flex-wrap gap-2 p-4">
            {error ? (
              <p className="text-red-500">{error.message}</p>
            ) : (
              parseStringMessages(message).map((msg, index) => (
                <Button
                  key={index}
                  variant="default"
                  className="rounded-full px-4 py-2 text-sm hover:scale-105 transition"
                  onClick={() => handleMessageClick(msg)}
                >
                  {msg}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <Separator className="my-12" />
      <Card className="bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg rounded-2xl">
        <CardHeader>
          <h3 className="text-2xl font-bold text-center">
            Want your own Message Board?
          </h3>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6">
            Create your account and start receiving anonymous messages today.
          </p>
          <Link href={"/sign-up"}>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 rounded-xl"
            >
              Create Account
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
