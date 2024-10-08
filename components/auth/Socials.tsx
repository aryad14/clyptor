"use client"

import React from 'react'
import { Button } from '@nextui-org/button'
import { useSearchParams } from 'next/navigation';
import { FcGoogle } from "react-icons/fc";
import { RxGithubLogo } from "react-icons/rx";

const Socials = () => {

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");

    return (
        <div className="flex items-center w-full gap-x-2">
            <Button
                radius='full'
                size="md"
                className="w-full bg-white border hover:bg-secondary"
            >
                <FcGoogle size={22}/>
            </Button>
            <Button
                radius='full'
                size="md"
                className="w-full bg-white border hover:bg-secondary"
            >
                <RxGithubLogo size={22}/>
            </Button>
        </div>
    )
}

export default Socials