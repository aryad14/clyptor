"use client"

import FormWrapper from "@/components/auth/FormWrapper"
import { Button } from "@nextui-org/button";
import { Input } from '@nextui-org/input'
import { useState } from 'react'
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginForm = () => {

    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <FormWrapper
            title="Welcome Back!"
            backBtnLabel="Dont have an account? Sign Up"
            backBtnHref="/auth/register"
            showSocial
        >
            <div className="flex flex-col gap-3">
                <Input
                    isRequired
                    size="md"
                    radius="lg"
                    type="email"
                    label="Email"
                    variant="bordered"
                    className="transition-all duration-250"
                />
                <Input
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
                <Button color="primary" radius="full">Login</Button>
            </div>
        </FormWrapper>
    )
}

export default LoginForm