"use client"

import FormWrapper from "@/components/auth/FormWrapper"
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input"
import { Form } from "@heroui/form";
import { InputOtp } from "@heroui/input-otp";
import { Divider } from "@heroui/divider";

import { useState, useTransition, useEffect, useRef } from 'react'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, Toaster } from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';

import { login } from "@/actions/auth.login"

import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LoginSchema } from "@/schema";

type IFormInput = z.infer<typeof LoginSchema>;

const LoginForm = () => {
    const router = useRouter();
    const { control, handleSubmit, formState: { errors } } = useForm<IFormInput>({
        resolver: zodResolver(LoginSchema)
    });

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");

    const [isVisible, setIsVisible] = useState(false);
    const [show2FA, setShow2FA] = useState(false);

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const [isPending, startTransition] = useTransition();

    const hasRun = useRef(false); // Track if the effect has already run
    useEffect(() => {
        if (!hasRun.current) {
            const urlParams = new URLSearchParams(window.location.search);
            const error = urlParams.get("error");
            if (error) {
                toast.error('An account with this email already exists.');
            }
            hasRun.current = true; // Set to true after the effect runs
        }
    }, [router]);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const onSubmit: SubmitHandler<IFormInput> = (data) => {
        setError("");
        setSuccess("");
        const toastId = toast.loading("Please Wait");
        startTransition(() => {
            login(data, callbackUrl)
                .then((res) => {
                    toast.dismiss(toastId);
                    if (res?.error) {
                        setError(res.error);
                        toast.error("Login failed: " + res.error);
                    }

                    if (res?.success) {
                        setSuccess(res?.success);
                        if (res?.success) {
                            toast.success("Login successful!");
                        }

                    }

                    if (res?.twoFactor) {
                        setShow2FA(true);
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
                title="Welcome back!"
                backBtnLabel="Don't have an account? Register"
                backBtnHref="/auth/register"
                showSocial
            >
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                    {!show2FA && (
                        <>
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
                                        endContent={
                                            <button className="focus:outline-none flex items-center justify-center" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                                                {isVisible ? (
                                                    <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                                                ) : (
                                                    <FaEye className="text-2xl text-default-400 pointer-events-none" />
                                                )}
                                            </button>
                                        }
                                        type={isVisible ? "text" : "password"}
                                        className="flex items-center justify-center transition-all"
                                    />
                                )}
                            />
                            <Link size="sm" className="px-1" href={"/auth/reset"}>Forgot Password</Link>
                        </>

                    )
                    }

                    {show2FA && (
                        <div className="flex flex-col gap-3 items-center">
                            <h2>Code</h2>
                            <Divider />
                            <Controller
                                name="code"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <InputOtp
                                        {...field}
                                        isRequired
                                        aria-label="OTP input field"
                                        length={6}
                                        name="otp"
                                        placeholder="Enter code"
                                        validationBehavior="native"
                                        size="md"
                                    />
                                )}
                            />
                        </div>
                    )
                    }
                    <Button
                        disabled={isPending}
                        color="primary"
                        fullWidth
                        radius="full"
                        type="submit"
                    >
                        {show2FA ? "Verify" : "Login"}
                    </Button>
                </form>
            </FormWrapper>
        </>
    )
}

export default LoginForm