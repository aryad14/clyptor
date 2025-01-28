"use client"

import React from 'react'
import { useSearchParams } from "next/navigation";
import { Button } from "@heroui/button"
import { FcGoogle } from "react-icons/fc";
import { RxGithubLogo } from "react-icons/rx";
import { FaDiscord } from 'react-icons/fa';

import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

const Socials = () => {

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");

    const onClick = (provider: "google" | "github" | "discord") => {
        signIn(provider, {
            callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
        });
    }

    return (
        <div className="flex items-center w-full gap-x-2">
            <Button
                radius='full'
                size="md"
                className="w-full bg-white border hover:bg-secondary"
                onClick={() => onClick("google")}
            >
                <FcGoogle size={22} />
            </Button>
            <Button
                radius='full'
                size="md"
                className="w-full bg-white border group hover:bg-[#0d1117]"
                onClick={() => onClick("github")}
            >
                <RxGithubLogo size={22} className=' group-hover:text-white transition-all' />
            </Button>
            <Button
                radius='full'
                size="md"
                className="w-full bg-white border hover:bg-[#5661ea] group"
                onClick={() => onClick("discord")}
            >
                <FaDiscord size={22} className='text-[#5661ea] group-hover:text-white transition-all' />
            </Button>
        </div>
    )
}

export default Socials