import { auth } from '@/auth'
import React from 'react'

const Dashboard = async () => {
  const session = await auth();
  return (
    <div className='md:px-20 my-4'>
      {JSON.stringify(session)}
    </div>
  )
}

export default Dashboard