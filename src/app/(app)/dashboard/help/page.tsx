"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  HelpCircle, 
  UserPlus, 
  Lock, 
  ShieldCheck, 
  Eye,
} from "lucide-react";

export default function HelpPage() {
  const sections = [
    {
      title: "Getting Started",
      icon: <UserPlus className="w-5 h-5" />,
      content: [
        {
          label: "1. Claim your username",
          text: "If you haven't already, go to your Account page to set a unique username."
        },
        {
          label: "2. Share your link",
          text: "Your inbox is accessible at blindsay.xyz/yourname. Share this link on your social media profiles, bio, or stories."
        },
        {
          label: "3. Receive messages",
          text: "Anyone with your link can send you a message. They do not need to have an account or be logged in. Messages are anonymous by default."
        }
      ]
    },
    {
      title: "Replies & Visibility",
      icon: <Eye className="w-5 h-5" />,
      content: [
        {
          label: "Private by default",
          text: "Messages sent to you are private. Only you can see them in your Inbox."
        },
        {
          label: "Public replies",
          text: "If you choose to reply to a message, that message and your reply become public on your profile page. This allows you to curate what appears on your public feed."
        },
        {
          label: "Unreplied messages",
          text: "Messages you don't reply to remain visible only to you."
        }
      ]
    },
    {
      title: "Anonymous Senders",
      icon: <Lock className="w-5 h-5" />,
      bodyText: `EchoBox allows unauthenticated users to send messages to your inbox. This lowers the barrier for honest feedback and thoughts.

While we do not track sender identities for anonymous messages, we employ abuse filters to protect your inbox.`
    },
    {
      title: "Safety & Moderation",
      icon: <ShieldCheck className="w-5 h-5" />,
      content: [
        {
          label: "Hidden Words",
          text: "You can define a list of words or phrases in your Account settings. Messages containing these words will be automatically blocked."
        },
        {
          label: "Pause Inbox",
          text: "Need a break? You can temporarily pause your inbox from the Account page. New messages will be rejected until the pause expires or you resume it manually."
        },
        {
          label: "Close Inbox",
          text: "You can close your inbox indefinitely if you no longer wish to receive messages."
        }
      ]
    }
  ];

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto p-4 pb-20">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <h1 className="text-5xl font-black uppercase tracking-tighter">Help & Guide</h1>
        <p className="text-xl font-bold text-black/60">How to use EchoBox effectively.</p>
      </header>

      <Separator className="h-[3px] bg-black" />

      {/* Grid of help sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((section, idx) => (
          <Card key={idx} className="border-[3px] border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden flex flex-col h-full">
            <CardHeader className="p-6 pb-2 flex flex-row items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="p-2 border-[2px] border-black bg-accent-yellow shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                     {section.icon}
                  </div>
                  <CardTitle className="text-xl font-black uppercase tracking-tight">{section.title}</CardTitle>
               </div>
            </CardHeader>
            <CardContent className="p-8 flex-grow flex flex-col gap-8">
               {section.content ? (
                 section.content.map((item, i) => (
                   <div key={i} className="flex flex-col gap-2">
                     <span className="text-xl font-black uppercase tracking-tight leading-none">{item.label}</span>
                     <p className="font-bold text-lg text-black/60 leading-snug">{item.text}</p>
                   </div>
                 ))
               ) : (
                 <p className="font-bold text-lg text-black/60 leading-snug whitespace-pre-wrap">{section.bodyText}</p>
               )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="flex justify-center mt-12">
        <Card className="border-[3px] border-black bg-black text-white rounded-none shadow-[8px_8px_0px_0px_rgba(251,191,36,1)] overflow-hidden">
           <CardContent className="p-10 text-center flex flex-col items-center gap-6">
              <HelpCircle className="w-12 h-12 text-accent-yellow" />
              <h3 className="text-3xl font-black uppercase tracking-tighter">Still have questions?</h3>
              <p className="text-white/70 font-bold max-w-md">Our support team is always here to help you get the most out of EchoBox.</p>
              <button className="bg-accent-yellow text-black border-[3px] border-black rounded-none px-10 py-4 text-xl font-black uppercase shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                Contact Support
              </button>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
