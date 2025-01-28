"use client"

import FormWrapper from "@/components/auth/FormWrapper"
import { Button } from "@heroui/button";
import { Input } from "@heroui/input"
import { useState, useTransition } from 'react'
import { toast, Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ResetSchema } from "@/schema";
import { resetPass } from "@/actions/auth.resetPass";

type IFormInput = z.infer<typeof ResetSchema>;

const LoginForm = () => {
    const router = useRouter();
    const { control, handleSubmit, formState: { errors } } = useForm<IFormInput>({
        resolver: zodResolver(ResetSchema)
    });
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const onSubmit: SubmitHandler<IFormInput> = (data) => {
        setError("");
        setSuccess("");
        const toastId = toast.loading("Please wait!!");
        startTransition(() => {
            resetPass(data)
                .then((res) => {
                    toast.dismiss(toastId);
                    if (res?.error) {
                        setError(res.error);
                        toast.error(res.error);
                    } else {
                        setSuccess(res?.success);
                        toast.success("Reset Link is Sent to your mail");
                        // router.push("/dashboard"); // Redirect to the dashboard
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
                title="Reset Your Password"
                backBtnLabel="Back to Login"
                backBtnHref="/auth/login"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                    <Controller
                        name="email"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Input
                                {...field}
                                isRequired
                                size="md"
                                radius="lg"
                                type="email"
                                label="Email"
                                variant="bordered"
                                className="transition-all duration-250"
                            />
                        )}
                    />
                    <Button color="primary" radius="full" type="submit">Reset Password</Button>
                </form>
            </FormWrapper>
        </>
    )
}

export default LoginForm