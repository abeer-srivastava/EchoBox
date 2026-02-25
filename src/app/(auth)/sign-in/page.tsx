"use client";
import * as z from "zod"
import { signInSchema } from "@/schemas/signInSchema";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Form,FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";



function Page() {

    const router=useRouter();

    const form=useForm<z.infer<typeof signInSchema>>({
        resolver:zodResolver(signInSchema),
        defaultValues:{
            identifier:"",
            password:""
        }
    });

    const onSubmit=async (data:z.infer<typeof signInSchema>)=>{
        const result=await signIn("credentials",{
            redirect:false,
            identifier:data.identifier,
            password:data.password
        });
        console.log("outside url",result);//TODO:
        if(result?.error){
            if(result.error === "CredentialsSignin"){
                toast.warning("Login Failed",{description:"Incorrect Username or Password"});

            }else{
                toast.error("Error",{description:result.error});
            }
        }
      if (result?.url) {
        console.log("inside url",result.url)
      router.replace('/dashboard');
    }
    };


    return (
    <div className="text-black flex justify-center items-center min-h-screen bg-secondary-background p-6">
      <div className="w-full max-w-md p-10 space-y-8 bg-white border-[3px] border-border shadow-brutal-lg">
        <div className="text-center">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">
            Welcome Back 
          </h1>
          <p className="font-bold text-black/60 uppercase text-sm">Sign in to your <span className="text-brand-primary">Echobox</span> account</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-black uppercase">Email/Username</FormLabel>
                  <Input {...field} placeholder="Email/Username"/>
                  <FormMessage className="font-bold text-accent-red" />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-black uppercase">Password</FormLabel>
                  <Input type="password" {...field} />
                  <FormMessage className="font-bold text-accent-red" />
                </FormItem>
              )}
            />
            <Button size="lg" className='w-full text-xl font-black uppercase h-14 shadow-brutal-md' type="submit">Sign In</Button>
          </form>
        </Form>
        <div className="text-center mt-8 pt-6 border-t-[3px] border-border">
          <p className="font-bold text-black/60 uppercase text-sm">
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-brand-primary underline decoration-[2px] underline-offset-4 hover:bg-accent-yellow">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Page;