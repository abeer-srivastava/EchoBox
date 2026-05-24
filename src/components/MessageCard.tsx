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
import { X, Pencil, Trash2, Reply, Loader2, MessageSquareReply, Check, Share2, Calendar } from "lucide-react";
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
    <Card className="bg-secondary-background border border-border rounded-2xl shadow-sm transition-all hover:border-brand-primary/20 duration-200">
      <CardHeader className="p-6">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-lg font-semibold leading-snug tracking-tight break-words">
            {localMessage.content}
          </CardTitle>
          <div className="flex gap-1.5 shrink-0">
            <Button
              variant="outline"
              size="icon"
              className="size-9 rounded-xl border border-border hover:bg-white/5 transition-colors"
              onClick={copyToClipboard}
              title="Share profile link"
            >
              <Share2 className="w-4 h-4 text-muted" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant='danger' 
                  size="icon" 
                  className="size-9 rounded-xl bg-accent-red/10 border border-accent-red/20 text-accent-red hover:bg-accent-red hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border border-border rounded-2xl bg-secondary-background max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl font-bold">Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className="text-sm text-muted">
                    This action cannot be undone. This will permanently delete this message from your inbox.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 mt-4">
                  <AlertDialogCancel className="rounded-xl border border-border hover:bg-white/5">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteConfirm} className="bg-accent-red hover:bg-accent-red/90 text-white rounded-xl">
                    Delete Permanently
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <div className="bg-brand-primary/10 border border-brand-primary/20 text-brand-primary px-2 py-0.5 rounded-md text-[10px] font-semibold flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {dayjs(localMessage.createdAt).format('MMM D, YYYY')}
          </div>
          <div className="px-2 py-0.5 bg-white/5 border border-border text-[10px] font-medium text-muted rounded-md">
            {dayjs(localMessage.createdAt).format('h:mm A')}
          </div>
          {localMessage.senderName && (
            <div className="px-2 py-0.5 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-semibold rounded-md">
              From: {localMessage.senderName}
            </div>
          )}
        </div>

        {localMessage.replyText ? (
          <div className="mt-6 p-4 bg-background border border-border rounded-xl relative group/reply">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <MessageSquareReply className="w-4 h-4 text-brand-primary" />
                <span className="text-[11px] text-muted font-medium">
                  REPLY • {dayjs(localMessage.repliedAt).fromNow()}
                </span>
              </div>
              <div className="flex gap-1.5 opacity-0 group-hover/reply:opacity-100 transition-opacity">
                <Button 
                  size="icon" 
                  variant="ghost"
                  className="h-7 w-7 rounded-lg hover:bg-white/5 hover:text-brand-primary transition-colors" 
                  onClick={() => setIsReplying(true)}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-7 w-7 rounded-lg hover:bg-white/5 hover:text-accent-red transition-colors" 
                  onClick={handleDeleteReply}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
            <p className="text-base font-medium leading-relaxed italic text-foreground/90 break-words">&quot;{localMessage.replyText}&quot;</p>
          </div>
        ) : isReplying ? (
          <div className="mt-6 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <textarea
              className="w-full p-3 border border-border rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-brand-primary bg-background text-sm transition-all"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your public reply..."
              rows={3}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button 
                size="sm" 
                variant="outline" 
                className="rounded-xl"
                onClick={() => {
                  setIsReplying(false);
                  setReplyText(localMessage.replyText || "");
                }}
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                className="rounded-xl"
                onClick={handleSaveReply} 
                disabled={isSavingReply}
              >
                {isSavingReply ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Check className="w-3.5 h-3.5 mr-1.5" />}
                Save Reply
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="neutral"
            size="sm"
            className="mt-5 w-full hover:bg-white/5 border border-border bg-background rounded-xl font-medium"
            onClick={() => setIsReplying(true)}
          >
            <Reply className="w-4 h-4 mr-2 text-brand-primary" /> Reply to message
          </Button>
        )}
      </CardHeader>
    </Card>
  );
}