import React from 'react'
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter
} from "@heroui/card"
import { Button } from "@heroui/button"
import { Link } from "@heroui/link"

const page = () => {
    return (
        <Card className='min-w-[350px] max-w-[400px] py-6'>
            <CardHeader className='justify-center'>
                <h2 className='text-3xl font-bold'>Error</h2>
            </CardHeader>
            <CardBody>
                <p className='text-center'>Something went wrong. Please try again.</p>
            </CardBody>
            <CardFooter className='justify-center'>
                <Button
                    className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
                >
                    <Link href='/auth/login' className='text-white'>
                        Go back
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

export default page