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
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";


function Dashboard() {

    const [messages,setMessages]=useState<Message[]>([]);
    const [isLoading,setIsLoading]=useState(false);
    const [isSwitchLoading,setIsSwitchLoading]=useState(false);

    const handleDeleteMessage=(messageId:string)=>{
        setMessages(messages.filter((message)=>
            message._id!==messageId));
    }
    const {data:session}=useSession();
    const user:User=session?.user;  
    // console.log("session ---------------------------",session);
    // console.log("Userr session============",user);

    const form = useForm({
        resolver:zodResolver(acceptMessageSchema)
    });
    
    const {register,watch,setValue}=form;

    // Watch and subscribe to the entire form update/change based on onChange and re-render at the useForm.
    const acceptMessages=watch("acceptMessages")

    const fetchAcceptMessage=useCallback(async()=>{
        setIsSwitchLoading(true);
        try {
          console.log("inside the fetch")
            const response=await axios.get<ApiResponse>(`/api/accepting-messages`)
            setValue("acceptMessages",response.data.isAcceptingMessages ?? false)
        } catch (error) {
            console.error(error);
            toast.error("Error",{description:"Failed to Fetch the message settings"})
        }finally{
            setIsSwitchLoading(false);
        }
    },[setValue])


     const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(true);
      try {
        const response = await axios.get<ApiResponse>('/api/get-messages');
        setMessages(response.data.messages || []);
        if (refresh) {
          toast('Refreshed Messages',{
            description: 'Showing latest messages',
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.warning(
          'Error',{
          description:
            axiosError.response?.data.message ?? 'Failed to fetch messages'
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );
  // Fetch initial state from the server
  useEffect(()=>{
    if(!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  },[session,setValue,fetchMessages,fetchAcceptMessage]);

  const handleSwitchChange=async()=>{
    try {
         const response= await axios.post(`api/accepting-messages`,{
            acceptMessages:!acceptMessages
        })
        setValue("acceptMessages",!acceptMessages);
        toast.info(response.data.message,{
            description:response.data.message
        })
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.warning(
          'Error',{
          description:
            axiosError.response?.data.message ?? 'Failed to fetch messages'
        });
    }
  }

 
  if (!session || !session.user) {
    return <div>Please Login</div>;
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast('URL Copied!',{
      description: 'Profile URL has been copied to clipboard.',
    });
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="default"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id as string}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;