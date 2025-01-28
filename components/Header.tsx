import React from 'react'
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
} from "@heroui/navbar"

import { Button } from "@heroui/button"
import { Link } from "@heroui/link"
import { signOut } from '@/auth'

const Header = ({ session }: { session: any }) => {
    return (
        <Navbar maxWidth='full' className='md:px-14 my-2 shadow-md'>
            <NavbarBrand className='ms-auto'>
                <p className="font-bold text-xl">
                    <span className='text-xl'>🔐 </span>
                    Clyptor
                </p>
            </NavbarBrand>
            <NavbarContent justify="end" className='gap-2'>
                <NavbarItem>
                    {session ? (
                        <form action={async () => {
                            "use server";
                            await signOut();
                        }}>
                            <Button type='submit' color='primary' radius='full'>Logout</Button>
                        </form>
                    ) : (
                        <Button color='primary' radius='full' as={Link} href='/auth/register'>Get Started</Button>
                    )}
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    )
}

export default Header