"use client";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X, Pencil, Trash2, Reply, Loader2, MessageSquareReply, Check, Share2 } from "lucide-react";
import { Message } from "@/model/User";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState, useEffect } from "react";

dayjs.extend(relativeTime);

type MessageCardProps = {
  message: Message,
  onMessageDelete: (messageId: string) => void,
  onReplyUpdate?: (messageId: string, replyText?: string) => void,
  username?: string
}

export default function MessageCard({ message, onMessageDelete, onReplyUpdate, username }: MessageCardProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState(message.replyText || "");
  const [isSavingReply, setIsSavingReply] = useState(false);
  const [localMessage, setLocalMessage] = useState(message);

  useEffect(() => {
    setLocalMessage(message);
    setReplyText(message.replyText || "");
  }, [message]);

  const copyToClipboard = () => {
    if (!username) return;
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/u/${username}`;
    navigator.clipboard.writeText(url);
    toast.success("Profile link copied!");
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
      toast.success(response.data.message);
      onMessageDelete(String(message._id))
    }
    catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error Occurred During Deletion", {
        description:
          axiosError.response?.data.message ?? 'Failed to delete message',
      });
    }
  }

  const handleSaveReply = async () => {
    if (!replyText.trim()) {
      toast.warning("Reply cannot be empty");
      return;
    }
    
    if (!message._id) {
      toast.error("Message ID is missing. Cannot save reply.");
      return;
    }

    setIsSavingReply(true);
    try {
      const response = await axios.post<ApiResponse>('/api/reply-message', {
        messageId: message._id,
        replyText
      });
      toast.success(response.data.message);
      setIsReplying(false);
      
      const updatedMessage = {
        ...localMessage,
        replyText: replyText,
        repliedAt: new Date()
      } as Message;
      
      setLocalMessage(updatedMessage);
      if (onReplyUpdate) onReplyUpdate(String(message._id), replyText);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Failed to save reply", {
        description: axiosError.response?.data.message
      });
    } finally {
      setIsSavingReply(false);
    }
  };

  const handleDeleteReply = async () => {
    try {
      const response = await axios.request<ApiResponse>({
        method: 'DELETE',
        url: '/api/reply-message',
        data: { messageId: message._id }
      });
      toast.success(response.data.message);
      
      setLocalMessage({
        ...localMessage,
        replyText: undefined,
        repliedAt: undefined
      } as Message);
      setReplyText("");
      
      if (onReplyUpdate) onReplyUpdate(String(message._id), undefined);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Failed to delete reply", {
        description: axiosError.response?.data.message
      });
    }
  };


  return (
    <Card className="bg-white transition-colors group border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none">
      <CardHeader className="p-6">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-xl font-black leading-tight">{localMessage.content}</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="neutral"
              size="icon"
              className="shrink-0 h-10 w-10 border-[3px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
              onClick={copyToClipboard}
              title="Share profile link"
            >
              <Share2 className="w-5 h-5" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant='danger' size="icon" className="shrink-0 h-10 w-10 border-[3px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all bg-accent-red">
                  <X className="w-5 h-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border-[4px] border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-3xl font-black uppercase tracking-tighter">Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className="font-bold text-black/60">
                    This action cannot be undone. This will permanently delete
                    this message from your inbox.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-4">
                  <AlertDialogCancel className="border-[3px] border-black rounded-none font-black uppercase">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteConfirm} className="bg-accent-red text-white border-[3px] border-black rounded-none font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                    Delete Permanently
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-2">
          <div className="bg-accent-yellow px-2 py-1 border-[2px] border-black text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {dayjs(localMessage.createdAt).format('MMM D, YYYY')}
          </div>
          <div className="px-2 py-1 bg-white border-[2px] border-black text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {dayjs(localMessage.createdAt).format('h:mm A')}
          </div>
        </div>

        {localMessage.replyText ? (
          <div className="mt-6 p-4 bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative group/reply">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <MessageSquareReply className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase text-black/50">
                  REPLY • {dayjs(localMessage.repliedAt).fromNow()}
                </span>
              </div>
              <div className="flex gap-1 opacity-0 group-hover/reply:opacity-100 transition-opacity">
                <Button 
                  size="icon" 
                  variant="neutral"
                  className="h-8 w-8 hover:bg-accent-yellow border-2 border-transparent hover:border-black transition-all" 
                  onClick={() => setIsReplying(true)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="neutral" 
                  className="h-8 w-8 hover:bg-accent-red hover:text-white border-2 border-transparent hover:border-black transition-all" 
                  onClick={handleDeleteReply}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="font-bold text-lg leading-snug">{localMessage.replyText}</p>
          </div>
        ) : isReplying ? (
          <div className="mt-6 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <textarea
              className="w-full p-4 border-[3px] border-black rounded-none font-bold focus:outline-none focus:ring-0 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your public reply..."
              rows={3}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button 
                size="sm" 
                variant="neutral" 
                className="font-black uppercase border-[2px] border-black rounded-none"
                onClick={() => {
                  setIsReplying(false);
                  setReplyText(localMessage.replyText || "");
                }}
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                className="font-black uppercase bg-accent-yellow text-black border-[3px] border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                onClick={handleSaveReply} 
                disabled={isSavingReply}
              >
                {isSavingReply ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                Save Reply
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="neutral"
            size="sm"
            className="mt-6 w-full font-black uppercase border-[3px] border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all bg-white hover:bg-accent-yellow"
            onClick={() => setIsReplying(true)}
          >
            <Reply className="w-4 h-4 mr-2" /> Reply to message
          </Button>
        )}
      </CardHeader>
    </Card>
  );

}