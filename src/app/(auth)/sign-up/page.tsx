"use client";
import { useDebounceValue } from 'usehooks-ts'
import { useEffect, useState } from 'react';
import {zodResolver} from "@hookform/resolvers/zod"
import {SubmitHandler, useForm} from "react-hook-form"
import Link from 'next/link';
import * as z from "zod"
import { toast } from "sonner"
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';
import axios,{AxiosError} from "axios"
import { ApiResponse } from '@/types/ApiResponse';


function Page() {
    const [username,setUsername] = useState("");
    const [usernameMessage,setUsernameMessage] = useState("")
    const [isCheckingUsername,setIsCheckingUsername] = useState(false)
    const [isSubmitting,setIsSubmitting]=useState(false)

    const debouncedUsername=useDebounceValue(username,300)

    const router=useRouter()

    // zod implementation
    const form =useForm({
        resolver:zodResolver(signUpSchema),
        defaultValues:{
            username:'',
            email:'',
            password:''
        }
    })

    useEffect(()=>{
        const checkUsernameUnique=async ()=>{
            if(debouncedUsername){
                setIsCheckingUsername(true);
                setUsernameMessage("")
                try {
                    const response=await axios.get(`/api/check-username-unique?username=${debouncedUsername}`)
                    setUsernameMessage(response.data.message)
                } catch (error) {
                   const axiosError=error as AxiosError<ApiResponse>
                   setUsernameMessage(String(axiosError.response?.data.message)??"Error checking username")
                }finally{
                    setIsCheckingUsername(false);
                }
            }
        }
        checkUsernameUnique()
    },[debouncedUsername])

    const onSubmit=async (data:z.infer<typeof signUpSchema>)=>{
            setIsSubmitting(true);
            try {
                const response=await axios.post<ApiResponse>("/api/sign-up",data);
                toast.message(response.data.message,{
                    
                });
                router.replace(`/verify/${username}`);
                setIsSubmitting(false);

            } catch (error) {
                console.error("Error in signup  ",error)
                const axiosError=error as AxiosError<ApiResponse>
                const errorMessage=axiosError.response?.data.message
                toast.warning(errorMessage, {
                description: 'Error',
                });
            }
    }

    return ( 
        <>Page</>
     );
}

export default Page;