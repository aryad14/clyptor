"use client"

import {
    Card,
    CardHeader,
    CardBody,
    CardFooter
} from '@nextui-org/card'
import Socials from './Socials'
import Link from 'next/link'

interface FormWrapperProps {
    children: React.ReactNode
    title: string
    backBtnLabel: string
    backBtnHref: string
    showSocial?: boolean
}

const FormWrapper = ({
    children,
    title,
    backBtnLabel,
    backBtnHref,
    showSocial
}: FormWrapperProps) => {
    return (
        <Card className='py-5 w-96 px-4'>
            <CardHeader className='justify-center'>
                <h4 className='font-bold text-xl'>{title}</h4>
            </CardHeader>
            <CardBody>
                {children}
            </CardBody>
            {showSocial && (
                <CardFooter>
                    <Socials />
                </CardFooter>
            )}
            <CardFooter className="w-full justify-center">
                <Link className='text-gray-600 hover:text-gray-800 transition-all duration-250' href={backBtnHref}>{backBtnLabel}</Link>
            </CardFooter>
        </Card>
    )
}

export default FormWrapper