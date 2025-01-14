"use client"

import { lineWobble } from "ldrs"
import FormWrapper from "./FormWrapper"
import { toast, Toaster } from 'react-hot-toast';

import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState, useRef } from "react"

import { Verify } from "@/actions/auth.verify"

export const VerificationForm = () => {
    lineWobble.register()

    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()

    const effectRun = useRef(false);

    const onSubmit = useCallback(() => {
        if (!token) {
            setError("Token not Found")
            return;
        }

        Verify(token)
            .then((data) => {
                setSuccess(data.success)
                setError(data.error)
            })
            .catch(() => {
                setError("Something went wrong!")
            })
    }, [token])

    useEffect(() => {
        if (!effectRun.current) {
            effectRun.current = true;
            onSubmit()
        }
    }, [onSubmit])

    return (
        <>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <FormWrapper
                title="Confirming your Email"
                backBtnLabel="Back to Login"
                backBtnHref="/auth/login"
            >
                <div className="flex items-center w-full justify-center">
                    {!success && !error && (
                        <l-line-wobble
                            size="80"
                            stroke="5"
                            bg-opacity="0.1"
                            speed="1.75"
                            color="black"
                        ></l-line-wobble>
                    )}
                    {success}
                    {error}
                </div>
            </FormWrapper>
        </>
    )
}