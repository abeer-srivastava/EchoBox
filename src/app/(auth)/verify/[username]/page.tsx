"use client";
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useState } from "react";
import { Loader2, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{username: string}>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/verify-code", {
        username: params.username,
        code: data.code
      });
      
      toast.success("Success", {
        description: response.data.message
      });
      
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error in verification:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message || "Verification failed";
      
      toast.error("Verification Failed", {
        description: errorMessage,
      });
    } finally {
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
        className="w-full max-w-md p-8 bg-secondary-background border border-border rounded-2xl shadow-lg relative"
      >
        <div className="text-center mb-8">
          <motion.div 
            variants={itemVariants} 
            className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center mx-auto mb-4"
          >
            <ShieldAlert className="w-6 h-6 text-brand-primary" />
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-3xl font-bold tracking-tight mb-2">
            Verify Your Account
          </motion.h1>
          <motion.p variants={itemVariants} className="text-sm text-muted">
            Enter the 6-digit verification code sent to your email
          </motion.p>
        </div>
        
        <motion.div variants={itemVariants}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground">Verification Code</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter 6-digit code" 
                        className="bg-background tracking-widest text-center text-lg font-bold"
                        {...field}
                        maxLength={6}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-accent-red font-medium" />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Account"
                )}
              </Button>
            </form>
          </Form>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default VerifyAccount;