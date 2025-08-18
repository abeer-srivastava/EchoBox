"use client"
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessage";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw, Link as LinkIcon } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";


function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { data: session } = useSession();
  // const user: User = session?.user as User;

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>(`/api/accepting-messages`);
      setValue("acceptMessages", response.data.isAcceptingMessages ?? false);
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: "Failed to fetch message settings",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(true);
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
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, fetchMessages, fetchAcceptMessage]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post(`api/accepting-messages`, {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast.info(response.data.message, {
        description: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.warning("Error", {
        description:
          axiosError.response?.data.message ?? "Failed to fetch messages",
      });
    }
  };

  if (!session || !session.user) {
    return <div className="text-center mt-20">Please Login</div>;
  }

  const { username } = session.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast("URL Copied!", {
      description: "Profile URL has been copied to clipboard.",
    });
  };

  return (
    <div className="my-10 mx-4 lg:mx-auto w-full max-w-6xl space-y-8 bg-gradient-to-b from-emerald-50 via-white to-lime-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">🎯 Dashboard</h1>
        <Button
          variant="default"
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

      <Separator />

      {/* Profile Link Section */}
      <div className="p-6 rounded-2xl border shadow-sm bg-white space-y-4">
        <h2 className="text-xl font-semibold">Your Unique Link</h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="flex-1 rounded-lg border p-2 text-sm"
          />
          <Button onClick={copyToClipboard} className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" /> Copy
          </Button>
        </div>
      </div>

      {/* Settings Section */}
      <div className="p-6 rounded-2xl border shadow-sm bg-white flex items-center justify-between">
        <span className="text-lg font-medium">
          Accept Messages:{" "}
          <span className="font-semibold">
            {acceptMessages ? "On" : "Off"}
          </span>
        </span>
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
          className="bg-gray-400"
        />
      </div>

      {/* Messages Section */}
      <div className="p-6 rounded-2xl border shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4">📩 Messages</h2>
        {messages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {messages.map((message) => (
              <MessageCard
                key={message._id as string}
                message={message}
                onMessageDelete={(id) =>
                  setMessages(messages.filter((msg) => msg._id !== id))
                }
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-6">
            No messages to display yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
