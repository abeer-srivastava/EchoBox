"use client";
import {useDebounceCallback } from "usehooks-ts";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {  useForm } from "react-hook-form";
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
import { Loader } from 'lucide-react';

function Page() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 300);

  const router = useRouter();

  // zod implementation
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
      toast.message(response.data.message, {
        description:response.data.message
      });
      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error in signup  ", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast.warning(errorMessage, {
        description: errorMessage,
      });

      setIsSubmitting(false);
    }
  };
// bg-[#5e736c]
// bg-[#a9ccbd]
  return (
    
    <div className="flex justify-center items-center min-h-screen text-black bg-secondary-background p-6">
      <div className="w-full max-w-md p-10 space-y-8 bg-white border-[3px] border-border shadow-brutal-lg">
        <div className="text-center">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">
            Join Echobox
          </h1>
          <p className="font-bold text-black/60 uppercase text-sm">Sign up to start your <span className="text-accent-pink">anonymous</span> adventure</p>
        </div>
        <div className="">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-black uppercase">Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field}
                    onChange={(e)=>{
                        field.onChange(e)
                        debounced(e.target.value)
                    }}
                    />
                  </FormControl>
                   {isCheckingUsername && <Loader className="animate-spin" />}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-xs font-bold uppercase ${
                        usernameMessage === 'Username is unique'
                          ? 'text-accent-green'
                          : 'text-accent-red'
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage className="font-bold text-accent-red" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-black uppercase">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field}
                    />
                  </FormControl>
                  <FormMessage className="font-bold text-accent-red" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-black uppercase">Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field}
                    />
                  </FormControl>
                  <FormMessage className="font-bold text-accent-red" />
                </FormItem>
              )}
            />
            <Button size="lg" className="w-full mt-6 text-xl font-black uppercase h-14 shadow-brutal-md" type="submit" disabled={isSubmitting} >
                {!isSubmitting?("SignUp"):(<><Loader className="mr-2 h-4 w-4 animate-spin"/>Please Wait</>)}
            </Button>
          </form>
        </Form>
         <div className="text-center mt-8 pt-6 border-t-[3px] border-border">
          <p className="font-bold text-black/60 uppercase text-sm">
            Already a member?{' '}
            <Link href="/sign-in" className="text-brand-primary underline decoration-[2px] underline-offset-4 hover:bg-accent-yellow">
              Sign in
            </Link>
          </p>
        </div>
        </div>

      </div>
    </div>
  );
}

export default Page;