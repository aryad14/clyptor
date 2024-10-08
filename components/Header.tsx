import React from 'react'
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
} from '@nextui-org/navbar'

import { Button } from '@nextui-org/button'
import { Link } from '@nextui-org/link'

const Header = () => {
    return (
        <Navbar maxWidth='full' className='px-14 my-2 shadow-md'>
            <NavbarBrand className='ms-auto'>
                <p className="font-bold text-xl">
                    <span className='text-xl'>🔐 </span>
                    Clyptor
                </p>
            </NavbarBrand>
            <NavbarContent justify="end" className='gap-2'>
                <NavbarItem>
                    <Button color='primary' radius='full' as={Link} href='/login'>Login</Button>
                </NavbarItem>
                <NavbarItem>
                    <Button as={Link} radius='full' color="secondary" className='text-black' href="/register">
                        Sign Up
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    )
}

export default Header