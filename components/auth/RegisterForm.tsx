"use client"

import FormWrapper from "@/components/auth/FormWrapper"
import { Button } from "@nextui-org/button";
import { Input } from '@nextui-org/input'
import { useState, useTransition } from 'react'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, Toaster } from 'react-hot-toast';

import { register } from "@/actions/auth.register"

import { useForm, SubmitHandler, Controller } from "react-hook-form"

interface IFormInput {
    name: string;
    email: string;
    password: string;
}

const RegisterForm = () => {
    const { control, handleSubmit, formState: { errors } } = useForm<IFormInput>();
    const [isVisible, setIsVisible] = useState(false);
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const toggleVisibility = () => setIsVisible(!isVisible);

    const onSubmit: SubmitHandler<IFormInput> = (data) => {
        setError("");
        setSuccess("");
        const toastId = toast.loading("Registering...");
        startTransition(() => {
            register(data).then((res) => {
                toast.dismiss(toastId);
                if (res.error) {
                    setError(res.error);
                    toast.error(res.error);
                } else {
                    setSuccess(res.message);
                    toast.success("User created!");
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
                title="Welcome to the community!"
                backBtnLabel="Already have an account? Login"
                backBtnHref="/auth/login"
                showSocial
            >
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                    <Controller
                        name="name"
                        control={control}
                        defaultValue=""
                        rules={{ required: "Name is required" }}
                        render={({ field }) => (
                            <Input
                                {...field}
                                isRequired
                                size="md"
                                radius="lg"
                                type="text"
                                label="Name"
                                variant="bordered"
                                className="transition-all duration-250"
                            />
                        )}
                    />
                    <Controller
                        name="email"
                        control={control}
                        defaultValue=""
                        rules={{ required: "Email is required" }}
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
                        rules={{ required: "Password is required" }}
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
                    <Button color="primary" radius="full" type="submit">Create Account</Button>
                </form>
            </FormWrapper>
        </>
    )
}

export default RegisterForm