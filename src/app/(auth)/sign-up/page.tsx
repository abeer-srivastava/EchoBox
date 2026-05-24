"use client";
import { useDebounceCallback } from "usehooks-ts";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader, UserPlus, Sparkles, Mail, Lock, User } from 'lucide-react';
import { motion } from "framer-motion";

function Page() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 300);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            String(axiosError.response?.data.message) ??
              "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast.success(response.data.message);
      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error in signup", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast.warning(errorMessage || "Failed to sign up");
      setIsSubmitting(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const containerVariants: any = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const itemVariants: any = {
    hidden: { y: 8, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-6">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md p-8 bg-secondary-background border border-border rounded-2xl shadow-lg relative overflow-hidden"
      >
        <div className="text-center mb-8">
          <motion.div 
            variants={itemVariants} 
            className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center mx-auto mb-4"
          >
            <UserPlus className="w-6 h-6 text-brand-primary" />
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-3xl font-bold tracking-tight mb-2">
            Join EchoBox
          </motion.h1>
          <motion.p variants={itemVariants} className="text-sm text-muted">
            Start your anonymous feedback adventure <Sparkles className="inline-block w-3.5 h-3.5 text-accent-yellow" />
          </motion.p>
        </div>

        <motion.div variants={itemVariants}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <User className="w-4 h-4 text-muted" /> Username
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="choose_a_name" 
                          className="bg-background"
                          {...field}
                          onChange={(e)=>{
                              field.onChange(e);
                              debounced(e.target.value);
                          }}
                        />
                        {isCheckingUsername && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <Loader className="animate-spin w-4 h-4 text-brand-primary" />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    {!isCheckingUsername && usernameMessage && (
                      <p
                        className={`text-xs font-semibold mt-1.5 ${
                          usernameMessage === 'Username is unique'
                            ? 'text-accent-green'
                            : 'text-accent-red'
                        }`}
                      >
                        {usernameMessage}
                      </p>
                    )}
                    <FormMessage className="text-xs text-accent-red font-medium" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted" /> Email
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="you@example.com" 
                        className="bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-accent-red font-medium" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Lock className="w-4 h-4 text-muted" /> Password
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        className="bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-accent-red font-medium" />
                  </FormItem>
                )}
              />
              <Button 
                size="default" 
                className="w-full mt-2" 
                type="submit" 
                disabled={isSubmitting} 
              >
                {!isSubmitting ? "Create Account" : (
                  <><Loader className="h-4 w-4 animate-spin"/> Processing</>
                )}
              </Button>
            </form>
          </Form>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center mt-6 pt-6 border-t border-border">
          <p className="text-sm text-muted">
            Already a member?{' '}
            <Link href="/sign-in" className="text-brand-primary font-semibold hover:underline">
              Sign in here
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Page;