"use client"
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
// import { Separator } from "@/components/ui/separator";
import { 
  Power, 
  Copy, 
  QrCode, 
  LogOut,
  Loader2,
  Check
} from "lucide-react";
import { ApiResponse } from "@/types/ApiResponse";

export default function AccountPage() {
  const { data: session } = useSession();
  // const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [accountData, setAccountData] = useState({
    username: "",
    email: "",
    isAcceptingMessages: true,
    privacyType: 'anonymous-only' as 'anonymous-only' | 'allow-named',
    hiddenWords: [] as string[],
    pauseUntil: null as string | null,
  });
  const [newUsername, setNewUsername] = useState("");
  const [hiddenWordsText, setHiddenWordsText] = useState("");

  const fetchAccountData = async () => {
    // setIsLoading(true);
    try {
      const response = await axios.get("/api/account");
      const data = response.data;
      setAccountData({
        username: data.username || "",
        email: data.email || "",
        isAcceptingMessages: data.isAcceptingMessages ?? true,
        privacyType: data.privacyType || 'anonymous-only',
        hiddenWords: data.hiddenWords || [],
        pauseUntil: data.pauseUntil || null,
      });
      setNewUsername(data.username || "");
      setHiddenWordsText((data.hiddenWords || []).join("\n"));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load account settings");
    } finally {
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) fetchAccountData();
  }, [session]);

  const updateAccount = async (updates: Partial<typeof accountData>) => {
    setIsUpdating(true);
    try {
      const response = await axios.post("/api/account", updates);
      toast.success(response.data.message);
      fetchAccountData();
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Failed to update settings");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="p-8 border-[4px] border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
          <h2 className="text-3xl font-black uppercase">Please Login</h2>
          <p className="mt-2 font-bold text-black/60">You need to be authenticated to manage your account.</p>
        </div>
      </div>
    );
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const profileUrl = `${baseUrl}/u/${accountData.username}`;

  const copyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="flex flex-col gap-10 max-w-4xl mx-auto p-4 pb-20">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <h1 className="text-5xl font-black uppercase tracking-tighter">Account</h1>
        <p className="text-xl font-bold text-black/60">Manage your profile and inbox settings.</p>
      </header>

      <div className="grid grid-cols-1 gap-12">
        {/* IDENTITY SECTION */}
        <section className="flex flex-col gap-6">
          <SectionLabel label="IDENTITY" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Share Link Card */}
            <Card className="border-[3px] border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
               <CardHeader className="p-6 pb-2 flex flex-row items-center justify-between">
                 <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Share Your Link</span>
                 <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Scan or Copy</span>
               </CardHeader>
               <CardContent className="p-6 flex flex-col gap-4">
                  <Input 
                    value={profileUrl} 
                    readOnly 
                    className="border-[2px] border-black rounded-none font-bold bg-secondary-background"
                  />
                  <Button 
                    onClick={copyLink}
                    className="w-full bg-accent-blue text-white border-[3px] border-black rounded-none font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                  >
                    <Copy className="w-4 h-4 mr-2" /> Copy Link
                  </Button>
               </CardContent>
            </Card>

            {/* QR Code Placeholder Card */}
            <Card className="border-[3px] border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white flex flex-col items-center justify-center p-6 gap-2">
               <div className="p-4 border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <QrCode className="w-20 h-20" />
               </div>
               <span className="text-[10px] font-black uppercase text-black/40">Scan to open.</span>
            </Card>
          </div>

          {/* Username Update Card */}
          <Card className="border-[3px] border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
             <CardHeader className="p-6 pb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Username</span>
             </CardHeader>
             <CardContent className="p-6 flex flex-col gap-4">
                <Input 
                  value={newUsername} 
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="border-[2px] border-black rounded-none font-black text-xl"
                  placeholder="Enter new username"
                />
                <p className="text-[10px] font-bold text-black/40">3-15 characters. Use letters, numbers, or underscores.</p>
                <Button 
                  onClick={() => updateAccount({ username: newUsername })}
                  disabled={isUpdating || newUsername === accountData.username}
                  className="w-full bg-accent-blue text-white border-[3px] border-black rounded-none font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                >
                  {isUpdating ? <Loader2 className="animate-spin w-4 h-4" /> : "Update username"}
                </Button>
             </CardContent>
          </Card>
        </section>

        {/* SESSION SECTION */}
        <section className="flex flex-col gap-6">
          <SectionLabel label="SESSION" />
          <Card className="border-[3px] border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
             <CardContent className="p-6 flex flex-col gap-6">
                <div className="flex items-center gap-4">
                   <div className="w-16 h-16 border-[3px] border-black bg-accent-yellow shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-3xl font-black">
                      {session.user.username?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase()}
                   </div>
                   <div className="flex flex-col">
                      <span className="text-2xl font-black uppercase tracking-tight">{session.user.username}</span>
                      <span className="font-bold text-black/60">{session.user.email}</span>
                   </div>
                </div>
                <Button 
                  onClick={() => signOut()}
                  className="w-full bg-accent-red text-white border-[3px] border-black rounded-none font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Sign out
                </Button>
             </CardContent>
          </Card>
        </section>

        {/* INBOX CONTROLS */}
        <section className="flex flex-col gap-6">
          <SectionLabel label="INBOX CONTROLS" />
          
          {/* Status Control */}
          <Card className="border-[3px] border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
             <CardContent className="p-6 flex items-center justify-between">
                <div className="flex flex-col">
                   <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Status</span>
                   <span className="text-2xl font-black uppercase tracking-tight">
                     {accountData.isAcceptingMessages ? "Active" : "Closed"}
                   </span>
                   <p className="text-[10px] font-bold text-black/40">
                     {accountData.isAcceptingMessages ? "Accepting new messages." : "Inbox is currently closed."}
                   </p>
                </div>
                <Button 
                  onClick={() => updateAccount({ isAcceptingMessages: !accountData.isAcceptingMessages })}
                  className={`border-[3px] border-black rounded-none px-6 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all ${accountData.isAcceptingMessages ? "bg-accent-red text-white" : "bg-accent-green text-black"}`}
                >
                  <Power className="w-4 h-4 mr-2" /> {accountData.isAcceptingMessages ? "Close" : "Open"}
                </Button>
             </CardContent>
          </Card>

          {/* Privacy Control */}
          <Card className="border-[3px] border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
             <CardContent className="p-6 flex items-center justify-between">
                <div className="flex flex-col">
                   <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Privacy</span>
                   <span className="text-2xl font-black uppercase tracking-tight">
                     {accountData.privacyType === 'anonymous-only' ? "Anonymous Only" : "Anonymous or Named"}
                   </span>
                   <p className="text-[10px] font-bold text-black/40">Allow senders to include their name.</p>
                </div>
                <Button 
                  onClick={() => updateAccount({ privacyType: accountData.privacyType === 'anonymous-only' ? 'allow-named' : 'anonymous-only' })}
                  className={`border-[3px] border-black rounded-none px-6 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all bg-accent-yellow text-black`}
                >
                  Switch to {accountData.privacyType === 'anonymous-only' ? 'Named' : 'Anonymous'}
                </Button>
             </CardContent>
          </Card>

          {/* Pause Control */}
          <Card className="border-[3px] border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
             <CardContent className="p-6 flex items-center justify-between">
                <div className="flex flex-col">
                   <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Pause</span>
                   <span className="text-2xl font-black uppercase tracking-tight">Ready</span>
                   <p className="text-[10px] font-bold text-black/40">Temporarily stop new messages.</p>
                </div>
                <div className="flex items-center gap-2">
                   <select className="p-2 border-[3px] border-black rounded-none font-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <option>6</option>
                      <option>12</option>
                      <option>24</option>
                   </select>
                   <Button 
                    className="bg-accent-blue text-white border-[3px] border-black rounded-none font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                   >
                     Pause
                   </Button>
                </div>
             </CardContent>
          </Card>
        </section>

        {/* MODERATION */}
        <section className="flex flex-col gap-6">
          <SectionLabel label="MODERATION" />
          <Card className="border-[3px] border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
             <CardContent className="p-6 flex flex-col gap-4">
                <div className="bg-secondary-background p-4 border-[2px] border-black rounded-none text-center">
                   <p className="font-bold text-black/60">Messages containing these words will be blocked.</p>
                </div>
                
                <div className="flex flex-col gap-2">
                   <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Hidden Words</span>
                   <Textarea 
                     value={hiddenWordsText}
                     onChange={(e) => setHiddenWordsText(e.target.value)}
                     className="border-[3px] border-black rounded-none min-h-[150px] font-bold focus:ring-0"
                     placeholder="Enter words or phrases, one per line"
                   />
                   <p className="text-[10px] font-bold text-black/40">Messages containing these words won&apos;t be delivered. Separate with commas or new lines.</p>
                </div>

                <Button 
                  onClick={() => updateAccount({ hiddenWords: hiddenWordsText.split(/[\n,]/).map(w => w.trim()).filter(Boolean) })}
                  className="w-full bg-accent-blue text-white border-[3px] border-black rounded-none font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                >
                  <Check className="w-4 h-4 mr-2" /> Save
                </Button>
             </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4">
       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">{label}</span>
       <div className="flex-grow h-[2px] bg-black/5" />
    </div>
  );
}
