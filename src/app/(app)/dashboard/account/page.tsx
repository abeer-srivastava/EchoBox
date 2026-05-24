"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Copy, 
  LogOut,
  Loader2,
  Check,
  User,
  Shield,
  Zap,
  LayoutDashboard,
  Settings,
  Mail,
  Lock
} from "lucide-react";
import { ApiResponse } from "@/types/ApiResponse";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

export default function AccountPage() {
  const { data: session } = useSession();
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
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-8 border border-border bg-secondary-background rounded-2xl shadow-sm text-center max-w-md w-full"
        >
          <h2 className="text-2xl font-bold font-heading text-accent-red">Access Denied</h2>
          <p className="mt-2 text-sm text-muted">Manage your profile and inbox settings securely.</p>
          <Button className="mt-6 h-10 px-5 text-sm font-medium" asChild>
            <a href="/sign-in">Sign In Now</a>
          </Button>
        </motion.div>
      </div>
    );
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const profileUrl = `${baseUrl}/u/${accountData.username}`;

  const copyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Link copied to clipboard!");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const itemVariants: any = {
    hidden: { y: 12, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col gap-8 max-w-4xl mx-auto p-4 pb-32"
    >
      {/* Header */}
      <motion.header variants={itemVariants} className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-primary/10 rounded-xl text-brand-primary">
            <Settings className="w-6 h-6" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-heading">Account Settings</h1>
        </div>
        <p className="text-base text-muted">Configure your profile, privacy, and moderation rules.</p>
      </motion.header>

      <motion.div variants={itemVariants}>
        <Separator className="bg-border" />
      </motion.div>

      <div className="grid grid-cols-1 gap-8">
        {/* IDENTITY SECTION */}
        <motion.section variants={itemVariants} className="flex flex-col gap-5">
          <SectionLabel label="Identity System" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            <Card className="md:col-span-2 bg-secondary-background border border-border rounded-2xl shadow-sm flex flex-col justify-between overflow-hidden">
               <CardHeader className="p-6 border-b border-border bg-brand-primary/5 flex flex-row items-center justify-between">
                 <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
                   <User className="w-4 h-4 text-brand-primary" /> Profile Link
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-6 flex flex-col gap-4">
                  <p className="text-xs text-muted font-medium">Copy your unique profile link and share it to start receiving anonymous messages.</p>
                  <div className="flex gap-2">
                    <Input 
                      value={profileUrl} 
                      readOnly 
                      className="h-10 bg-background font-medium text-xs border border-border"
                    />
                    <Button 
                      onClick={copyLink}
                      variant="outline"
                      className="h-10 px-4 text-xs font-semibold shrink-0"
                    >
                      <Copy className="w-4 h-4 mr-1.5" /> Copy
                    </Button>
                  </div>
               </CardContent>
            </Card>

            <Card className="bg-secondary-background border border-border rounded-2xl shadow-sm flex flex-col items-center justify-center p-6 gap-3">
               <div className="p-2 border border-border bg-white rounded-xl flex items-center justify-center">
                  <QRCodeSVG value={profileUrl} size={84} />
               </div>
               <span className="text-[10px] font-bold text-muted tracking-wider uppercase">Scan QR Code</span>
            </Card>
          </div>

          <Card className="bg-secondary-background border border-border rounded-2xl shadow-sm overflow-hidden">
             <CardHeader className="p-6 border-b border-border bg-brand-primary/5">
                <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4 text-brand-primary" /> Change Username
                </CardTitle>
             </CardHeader>
             <CardContent className="p-6 flex flex-col gap-4">
                <p className="text-xs text-muted font-medium">This will change your public profile URL. Your old URL will stop working.</p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input 
                      value={newUsername} 
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="h-10 pl-8 bg-background font-semibold text-sm border border-border"
                      placeholder="new_username"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 font-bold opacity-30 text-sm">@</div>
                  </div>
                  <Button 
                    onClick={() => updateAccount({ username: newUsername })}
                    disabled={isUpdating || newUsername === accountData.username}
                    className="h-10 px-5 text-sm font-semibold shrink-0"
                  >
                    {isUpdating ? <Loader2 className="animate-spin w-4 h-4" /> : "Save"}
                  </Button>
                </div>
             </CardContent>
          </Card>
        </motion.section>

        {/* INBOX CONTROLS */}
        <motion.section variants={itemVariants} className="flex flex-col gap-5">
          <SectionLabel label="Inbox Controls" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-secondary-background border border-border rounded-2xl shadow-sm">
               <CardContent className="p-6 flex items-center justify-between gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-brand-primary/10 rounded-xl text-brand-primary shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col leading-tight">
                       <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Accepting Messages</span>
                       <span className="text-base font-bold text-foreground mt-0.5">
                         {accountData.isAcceptingMessages ? "Inbox Open" : "Inbox Closed"}
                       </span>
                    </div>
                  </div>
                  <Switch 
                    checked={accountData.isAcceptingMessages}
                    onCheckedChange={(checked) => updateAccount({ isAcceptingMessages: checked })}
                    disabled={isUpdating}
                  />
               </CardContent>
            </Card>

            <Card className="bg-secondary-background border border-border rounded-2xl shadow-sm">
               <CardContent className="p-6 flex items-center justify-between gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-brand-primary/10 rounded-xl text-brand-primary shrink-0">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col leading-tight">
                       <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Privacy Mode</span>
                       <span className="text-base font-bold text-foreground mt-0.5">
                         {accountData.privacyType === 'anonymous-only' ? "Anonymous Only" : "Allow Named"}
                       </span>
                    </div>
                  </div>
                  <Switch 
                    checked={accountData.privacyType === 'allow-named'}
                    onCheckedChange={(checked) => updateAccount({ privacyType: checked ? 'allow-named' : 'anonymous-only' })}
                    disabled={isUpdating}
                  />
               </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* MODERATION */}
        <motion.section variants={itemVariants} className="flex flex-col gap-5">
          <SectionLabel label="Moderation Engine" />
          <Card className="bg-secondary-background border border-border rounded-2xl shadow-sm overflow-hidden">
             <CardHeader className="p-6 border-b border-border bg-brand-primary/5">
                <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
                  <Shield className="w-4 h-4 text-brand-primary" /> Hidden Words Filter
                </CardTitle>
             </CardHeader>
             <CardContent className="p-6 flex flex-col gap-6">
                <div className="bg-background/50 p-4 border border-border rounded-xl flex items-start gap-2.5">
                  <Zap className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-muted leading-relaxed">
                    Incoming messages containing any of these words or phrases will be blocked automatically before reaching your inbox.
                  </p>
                </div>
                
                <div className="flex flex-col gap-2">
                   <span className="text-xs font-semibold text-muted">Blocked Phrases List</span>
                   <Textarea 
                     value={hiddenWordsText}
                     onChange={(e) => setHiddenWordsText(e.target.value)}
                     className="min-h-[140px] text-sm p-4 bg-background border border-border focus:ring-0 rounded-xl"
                     placeholder="Enter words, one per line..."
                   />
                   <p className="text-[10px] text-muted font-medium">Separate items with commas or line breaks.</p>
                </div>

                <Button 
                  onClick={() => updateAccount({ hiddenWords: hiddenWordsText.split(/[\n,]/).map(w => w.trim()).filter(Boolean) })}
                  disabled={isUpdating}
                  className="w-full h-11 text-sm font-semibold shrink-0"
                >
                  {isUpdating ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Check className="w-4 h-4 mr-1.5" />}
                  Update Moderation Filters
                </Button>
             </CardContent>
          </Card>
        </motion.section>

        {/* DANGER ZONE */}
        <motion.section variants={itemVariants} className="flex flex-col gap-5 pt-8 border-t border-border">
           <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-accent-red">Danger Zone</span>
              <div className="flex-grow h-[1px] bg-accent-red/20" />
           </div>

           <Card className="bg-accent-red/5 border border-accent-red/20 rounded-2xl shadow-sm">
              <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                 <div className="flex flex-col gap-1 text-center sm:text-left">
                    <h3 className="text-base font-bold font-heading text-accent-red">Log Out Session</h3>
                    <p className="text-xs text-muted">Log out of your current session on this device.</p>
                 </div>
                 <Button 
                    variant="danger"
                    onClick={() => signOut()}
                    className="h-10 px-5 text-sm font-semibold shrink-0 flex items-center gap-1.5"
                  >
                    <LogOut className="w-4 h-4" /> Log Out
                  </Button>
              </CardContent>
           </Card>
        </motion.section>
      </div>
    </motion.div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
       <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">{label}</span>
       <div className="flex-grow h-[1px] bg-border/60" />
    </div>
  );
}
