"use client";
import * as z from "zod";
import { signInSchema } from "@/schemas/signInSchema";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { LogIn, Key, Mail, Loader } from "lucide-react";
import { useState } from "react";

function Page() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    });
    
    if (result?.error) {
      setIsSubmitting(false);
      if (result.error === "CredentialsSignin") {
        toast.warning("Login Failed", { description: "Incorrect Username or Password" });
      } else {
        toast.error("Error", { description: result.error });
      }
    }
    
    if (result?.url) {
      router.replace('/dashboard');
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
            <LogIn className="w-6 h-6 text-brand-primary" />
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-3xl font-bold tracking-tight mb-2">
            Welcome Back
          </motion.h1>
          <motion.p variants={itemVariants} className="text-sm text-muted">
            Sign in to your <span className="text-brand-primary font-semibold">EchoBox</span> account
          </motion.p>
        </div>

        <motion.div variants={itemVariants}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted" /> Email or Username
                    </FormLabel>
                    <Input 
                      {...field} 
                      placeholder="you@example.com"
                      className="bg-background"
                    />
                    <FormMessage className="text-xs text-accent-red font-medium" />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Key className="w-4 h-4 text-muted" /> Password
                    </FormLabel>
                    <Input 
                      type="password" 
                      {...field} 
                      placeholder="••••••••"
                      className="bg-background"
                    />
                    <FormMessage className="text-xs text-accent-red font-medium" />
                  </FormItem>
                )}
              />
              <Button 
                size="default" 
                className='w-full mt-2' 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <><Loader className="h-4 w-4 animate-spin" /> Verifying</>
                ) : "Sign In"}
              </Button>
            </form>
          </Form>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center mt-6 pt-6 border-t border-border">
          <p className="text-sm text-muted">
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-brand-primary font-semibold hover:underline">
              Sign up now
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Page;