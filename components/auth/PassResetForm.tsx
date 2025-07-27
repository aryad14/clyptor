"use client"

import FormWrapper from "@/components/auth/FormWrapper"
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input"
import { useState, useTransition, useEffect, useRef } from 'react'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, Toaster } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';

import { newPassword } from "@/actions/auth.newPass";

import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { NewPassSchema } from "@/schema";

type IFormInput = z.infer<typeof NewPassSchema>;

const PassResetForm = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const { control, handleSubmit, formState: { errors } } = useForm<IFormInput>({
        resolver: zodResolver(NewPassSchema)
    });
    const [isVisible, setIsVisible] = useState(false);
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const toggleVisibility = () => setIsVisible(!isVisible);

    const onSubmit: SubmitHandler<IFormInput> = (data) => {
        setError("");
        setSuccess("");
        const toastId = toast.loading("Please Wait");
        startTransition(() => {
            newPassword(data, token)
                .then((res) => {
                    toast.dismiss(toastId);
                    if (res?.error) {
                        setError(res.error);
                        toast.error(res.error);
                    } else {
                        setSuccess(res?.success);
                        if (res?.success) {
                            toast.success(res.success);
                        }
                    }
                }).catch((err) => {
                    toast.dismiss(toastId);
                    console.error(err);
                    setError("An error occurred. Please try again later.");
                    toast.error("An error occurred. Please try again later.");
                });
        });
    }

    return (
        <>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <FormWrapper
                title="Reset your Password"
                backBtnLabel="Back to Login"
                backBtnHref="/auth/login"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                    <Controller
                        name="password"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Input
                                {...field}
                                isRequired
                                label="Password"
                                variant="bordered"
                                // endContent={
                                //     <button className="focus:outline-none flex items-center justify-center" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                                //         {isVisible ? (
                                //             <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                                //         ) : (
                                //             <FaEye className="text-2xl text-default-400 pointer-events-none" />
                                //         )}
                                //     </button>
                                // }
                                type={isVisible ? "text" : "password"}
                                className="flex items-center justify-center transition-all"
                            />
                        )}
                    />
                    <Controller
                        name="confirmPassword"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Input
                                {...field}
                                isRequired
                                label="Confirm Password"
                                variant="bordered"
                                // endContent={
                                //     <button className="focus:outline-none flex items-center justify-center" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                                //         {isVisible ? (
                                //             <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                                //         ) : (
                                //             <FaEye className="text-2xl text-default-400 pointer-events-none" />
                                //         )}
                                //     </button>
                                // }
                                type={isVisible ? "text" : "password"}
                                className="flex items-center justify-center transition-all"
                            />
                        )}
                    />
                    <Button color="primary" radius="full" type="submit">Update Password</Button>
                </form>
            </FormWrapper>
        </>
    )
}

export default PassResetForm